import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminRequest } from "@/lib/admin-auth";
import { normalizeEmail } from "@/lib/newsletter/tokens";

export const runtime = "nodejs";

const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function detectSeparator(line: string): string {
  if (line.split("\t").length > 2) return "\t";
  return ",";
}

function parseRow(line: string, sep: string): string[] {
  const out: string[] = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      q = !q;
      continue;
    }
    if (!q && (sep === "\t" ? c === "\t" : c === ",")) {
      out.push(cur.trim());
      cur = "";
      continue;
    }
    cur += c;
  }
  out.push(cur.trim());
  return out;
}

function mapHeaderIndex(
  headers: string[],
  names: string[]
): number | undefined {
  const lower = headers.map((h) => h.trim().toLowerCase());
  for (const n of names) {
    const i = lower.indexOf(n.toLowerCase());
    if (i >= 0) return i;
  }
  return undefined;
}

export async function POST(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: "file required" }, { status: 400 });
  }

  const filename = (file as File).name || "import.csv";
  const text = await file.text();
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");
  if (lines.length < 1) {
    return NextResponse.json({ error: "empty file" }, { status: 400 });
  }

  const sep = detectSeparator(lines[0]);
  const headers = parseRow(lines[0], sep);
  const emailIdx = mapHeaderIndex(headers, ["email", "e-mail", "mail", "メール"]);
  if (emailIdx === undefined) {
    return NextResponse.json(
      { error: "missing email column (email / mail)" },
      { status: 400 }
    );
  }
  const nameIdx = mapHeaderIndex(headers, ["name", "名前", "氏名"]);
  const sourceIdx = mapHeaderIndex(headers, ["source", "由来"]);
  const confirmedIdx = mapHeaderIndex(headers, ["confirmed_at", "confirmedAt", "確認日時"]);

  let inserted = 0;
  let updated = 0;
  let skipped = 0;
  let invalid = 0;

  const job = await prisma.newsletterImportJob.create({
    data: {
      originalFilename: filename,
      totalRows: lines.length - 1,
      createdBy: "admin",
    },
  });

  const rowLogs: { rawEmail: string; normalizedEmail: string | null; resultType: string; message: string | null }[] = [];

  for (let li = 1; li < lines.length; li++) {
    const cols = parseRow(lines[li], sep);
    const rawEmail = (cols[emailIdx] || "").trim();
    const email = normalizeEmail(rawEmail);

    if (!email || !EMAIL_OK.test(email)) {
      invalid++;
      if (rowLogs.length < 300)
        rowLogs.push({
          rawEmail,
          normalizedEmail: null,
          resultType: "invalid",
          message: "format",
        });
      continue;
    }

    const name = nameIdx !== undefined ? cols[nameIdx]?.trim() || null : null;
    let source = sourceIdx !== undefined ? cols[sourceIdx]?.trim() || "legacy_import" : "legacy_import";
    if (!source) source = "legacy_import";

    let confirmedAt: Date | null = new Date();
    if (confirmedIdx !== undefined && cols[confirmedIdx]?.trim()) {
      const d = new Date(cols[confirmedIdx].trim());
      if (!Number.isNaN(d.getTime())) confirmedAt = d;
    }

    try {
      const existing = await prisma.newsletterSubscriber.findUnique({
        where: { email },
      });

      if (existing) {
        if (existing.status === "active" && existing.email === email) {
          skipped++;
          rowLogs.push({
            rawEmail,
            normalizedEmail: email,
            resultType: "skipped",
            message: "duplicate",
          });
          continue;
        }
        await prisma.newsletterSubscriber.update({
          where: { id: existing.id },
          data: {
            status: "active",
            name: name ?? existing.name,
            source,
            confirmedAt: confirmedAt ?? existing.confirmedAt,
            unsubscribedAt: null,
            updatedAt: new Date(),
          },
        });
        updated++;
        rowLogs.push({
          rawEmail,
          normalizedEmail: email,
          resultType: "updated",
          message: null,
        });
      } else {
        await prisma.newsletterSubscriber.create({
          data: {
            email,
            name,
            status: "active",
            source,
            confirmedAt,
          },
        });
        inserted++;
        rowLogs.push({
          rawEmail,
          normalizedEmail: email,
          resultType: "inserted",
          message: null,
        });
      }
    } catch (e) {
      invalid++;
      if (rowLogs.length < 300)
        rowLogs.push({
          rawEmail,
          normalizedEmail: email,
          resultType: "error",
          message: e instanceof Error ? e.message : String(e),
        });
    }
  }

  await prisma.newsletterImportJob.update({
    where: { id: job.id },
    data: {
      insertedRows: inserted,
      updatedRows: updated,
      skippedRows: skipped,
      invalidRows: invalid,
    },
  });

  if (rowLogs.length)
    await prisma.newsletterImportJobRow.createMany({
      data: rowLogs.map((r) => ({
        importJobId: job.id,
        rawEmail: r.rawEmail.slice(0, 500),
        normalizedEmail: r.normalizedEmail,
        resultType: r.resultType,
        message: r.message,
      })),
    });

  return NextResponse.json({
    jobId: job.id,
    totalRows: lines.length - 1,
    insertedRows: inserted,
    updatedRows: updated,
    skippedRows: skipped,
    invalidRows: invalid,
  });
}
