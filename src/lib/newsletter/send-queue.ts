import { prisma } from "@/lib/db";
import { getNewsletterResend, newsletterFromAddress } from "@/lib/newsletter/resend-mail";
import { buildNewsletterHtml } from "@/lib/newsletter/template";

const BATCH = 60;

export async function enqueueDeliveries(campaignId: string): Promise<number> {
  const count = await prisma.newsletterCampaignDelivery.count({
    where: { campaignId },
  });
  if (count > 0) return count;

  const subs = await prisma.newsletterSubscriber.findMany({
    where: { status: "active" },
    select: { id: true, email: true },
  });

  if (subs.length === 0) {
    await prisma.newsletterCampaign.update({
      where: { id: campaignId },
      data: {
        status: "sent",
        sentAt: new Date(),
        totalTargetCount: 0,
        updatedAt: new Date(),
      },
    });
    return 0;
  }

  await prisma.newsletterCampaignDelivery.createMany({
    data: subs.map((s) => ({
      campaignId,
      subscriberId: s.id,
      email: s.email,
      deliveryStatus: "queued",
    })),
  });

  await prisma.newsletterCampaign.update({
    where: { id: campaignId },
    data: {
      totalTargetCount: subs.length,
      updatedAt: new Date(),
    },
  });

  return subs.length;
}

async function processOneBatch(
  campaignId: string,
  resend: NonNullable<ReturnType<typeof getNewsletterResend>>
): Promise<number> {
  const campaign = await prisma.newsletterCampaign.findUnique({
    where: { id: campaignId },
  });
  if (!campaign) return 0;

  const queued = await prisma.newsletterCampaignDelivery.findMany({
    where: { campaignId, deliveryStatus: "queued" },
    take: BATCH,
  });

  let done = 0;
  for (const d of queued) {
    const subId = d.subscriberId || "";
    if (!subId) {
      await prisma.newsletterCampaignDelivery.update({
        where: { id: d.id },
        data: {
          deliveryStatus: "failed",
          errorMessage: "no subscriber",
          updatedAt: new Date(),
        },
      });
      await prisma.newsletterCampaign.update({
        where: { id: campaignId },
        data: { failedCount: { increment: 1 } },
      });
      continue;
    }

    const html = buildNewsletterHtml({
      subject: campaign.subject,
      preheader: campaign.preheader,
      bodyHtml: campaign.bodyHtml,
      ctaLabel: campaign.ctaLabel,
      ctaUrl: campaign.ctaUrl,
      deliveryId: d.id,
      subscriberId: subId,
    });

    try {
      const { data, error } = await resend.emails.send({
        from: newsletterFromAddress(),
        to: d.email,
        subject: campaign.subject,
        html,
      });

      if (error) {
        await prisma.newsletterCampaignDelivery.update({
          where: { id: d.id },
          data: {
            deliveryStatus: "failed",
            errorMessage: error.message,
            updatedAt: new Date(),
          },
        });
        await prisma.newsletterCampaign.update({
          where: { id: campaignId },
          data: { failedCount: { increment: 1 } },
        });
      } else {
        await prisma.newsletterCampaignDelivery.update({
          where: { id: d.id },
          data: {
            deliveryStatus: "sent",
            resendMessageId: data?.id ?? null,
            sentAt: new Date(),
            updatedAt: new Date(),
          },
        });
        await prisma.newsletterCampaign.update({
          where: { id: campaignId },
          data: { sentCount: { increment: 1 } },
        });
        done++;
      }
    } catch (e) {
      await prisma.newsletterCampaignDelivery.update({
        where: { id: d.id },
        data: {
          deliveryStatus: "failed",
          errorMessage: e instanceof Error ? e.message : String(e),
          updatedAt: new Date(),
        },
      });
      await prisma.newsletterCampaign.update({
        where: { id: campaignId },
        data: { failedCount: { increment: 1 } },
      });
    }
  }

  const remaining = await prisma.newsletterCampaignDelivery.count({
    where: { campaignId, deliveryStatus: "queued" },
  });

  if (remaining === 0) {
    await prisma.newsletterCampaign.update({
      where: { id: campaignId },
      data: {
        status: "sent",
        sentAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  return done;
}

/** Cron: promote scheduled campaigns, then process queued deliveries. */
export async function runNewsletterDispatcher(): Promise<{
  processed: number;
  error?: string;
}> {
  const resend = getNewsletterResend();
  if (!resend) {
    return { processed: 0, error: "RESEND_API_KEY missing" };
  }

  const now = new Date();

  const due = await prisma.newsletterCampaign.findFirst({
    where: {
      status: "scheduled",
      scheduledAt: { lte: now },
    },
    orderBy: { scheduledAt: "asc" },
  });

  if (due) {
    await prisma.newsletterCampaign.update({
      where: { id: due.id },
      data: { status: "sending", updatedAt: new Date() },
    });
    await enqueueDeliveries(due.id);
  }

  const sending = await prisma.newsletterCampaign.findFirst({
    where: { status: "sending" },
    orderBy: { updatedAt: "asc" },
  });

  if (!sending) return { processed: 0 };

  if (
    (await prisma.newsletterCampaignDelivery.count({
      where: { campaignId: sending.id },
    })) === 0
  ) {
    await enqueueDeliveries(sending.id);
  }

  const n = await processOneBatch(sending.id, resend);
  return { processed: n };
}

export async function startCampaignSend(campaignId: string): Promise<{
  ok: boolean;
  message?: string;
}> {
  const resend = getNewsletterResend();
  if (!resend) return { ok: false, message: "RESEND_API_KEY が未設定です。" };

  const c = await prisma.newsletterCampaign.findUnique({
    where: { id: campaignId },
  });
  if (!c) return { ok: false, message: "not found" };
  if (!["draft", "scheduled"].includes(c.status)) {
    return { ok: false, message: "このステータスからは送信開始できません。" };
  }

  await prisma.newsletterCampaign.update({
    where: { id: campaignId },
    data: { status: "sending", scheduledAt: null, updatedAt: new Date() },
  });

  await enqueueDeliveries(campaignId);

  let total = 0;
  let guard = 80;
  while (guard-- > 0) {
    const n = await processOneBatch(campaignId, resend);
    total += n;
    const remaining = await prisma.newsletterCampaignDelivery.count({
      where: { campaignId, deliveryStatus: "queued" },
    });
    if (remaining === 0) break;
  }

  return { ok: true, message: `processed batch run (approx ${total})` };
}
