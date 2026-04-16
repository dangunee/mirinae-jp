import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateRawToken, hashToken, normalizeEmail } from "@/lib/newsletter/tokens";
import { sendDoubleOptInEmail } from "@/lib/newsletter/subscribe-mail";
import { getNewsletterResend } from "@/lib/newsletter/resend-mail";

const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const runtime = "nodejs";

async function readBody(req: NextRequest): Promise<Record<string, string>> {
  const ct = req.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const body = await req.json().catch(() => ({}));
    return {
      email: String(body?.email ?? "").trim(),
      name: String(body?.name ?? "").trim(),
    };
  }
  const fd = await req.formData().catch(() => null);
  if (!fd) return {};
  return {
    email: String(fd.get("email") ?? fd.get("mail") ?? "").trim(),
    name: String(fd.get("name") ?? "").trim(),
  };
}

export async function POST(req: NextRequest) {
  if (!getNewsletterResend()) {
    return NextResponse.json(
      { ok: false, error: "mail_unavailable" },
      { status: 503 }
    );
  }

  const body = await readBody(req);
  const email = normalizeEmail(body.email || "");
  const name = body.name || undefined;

  if (!email || !EMAIL_OK.test(email)) {
    return NextResponse.json(
      { ok: false, error: "invalid_email" },
      { status: 400 }
    );
  }

  const existing = await prisma.newsletterSubscriber.findUnique({
    where: { email },
  });

  if (existing?.status === "active") {
    return NextResponse.json({
      ok: true,
      message: "already_registered",
      userMessageJa: "このメールアドレスは既に登録済みです。",
    });
  }

  const raw = generateRawToken();
  const tokenHash = hashToken(raw);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  if (existing) {
    await prisma.$transaction([
      prisma.newsletterSubscriptionToken.deleteMany({
        where: {
          email,
          purpose: "confirm_subscription",
          usedAt: null,
        },
      }),
      prisma.newsletterSubscriber.update({
        where: { id: existing.id },
        data: {
          status: "pending",
          name: name ?? existing.name,
          source:
            existing.status === "unsubscribed"
              ? "resubscribe"
              : existing.source,
          updatedAt: new Date(),
        },
      }),
    ]);

    const sub = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });
    if (!sub)
      return NextResponse.json({ ok: false, error: "db" }, { status: 500 });

    await prisma.newsletterSubscriptionToken.create({
      data: {
        subscriberId: sub.id,
        email,
        tokenHash,
        purpose: "confirm_subscription",
        expiresAt,
      },
    });
  } else {
    const sub = await prisma.newsletterSubscriber.create({
      data: {
        email,
        name: name || null,
        status: "pending",
        source: "web",
      },
    });
    await prisma.newsletterSubscriptionToken.create({
      data: {
        subscriberId: sub.id,
        email,
        tokenHash,
        purpose: "confirm_subscription",
        expiresAt,
      },
    });
  }

  const sent = await sendDoubleOptInEmail(email, raw);
  if (!sent) {
    return NextResponse.json(
      { ok: false, error: "send_failed" },
      { status: 500 }
    );
  }

  const wantsRedirect =
    (req.headers.get("accept") || "").includes("text/html") ||
    (req.headers.get("content-type") || "").includes(
      "application/x-www-form-urlencoded"
    );

  if (wantsRedirect) {
    return NextResponse.redirect(
      new URL(
        "/trial.html?newsletter=pending#tab03",
        req.nextUrl.origin
      ),
      303
    );
  }

  return NextResponse.json({
    ok: true,
    message: "confirmation_sent",
    userMessageJa:
      "確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。",
  });
}
