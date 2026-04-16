"use client";

import { useState } from "react";

export default function ImportPage() {
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const file = fd.get("file");
    if (!(file instanceof File) || file.size === 0) {
      setMsg("ファイルを選択してください");
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const upload = new FormData();
      upload.append("file", file);
      const res = await fetch("/api/admin/newsletter/import", {
        method: "POST",
        credentials: "include",
        body: upload,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "import failed");
      setMsg(
        `完了 job=${data.jobId}\n行: ${data.totalRows} / 新規 ${data.insertedRows} / 更新 ${data.updatedRows} / スキップ ${data.skippedRows} / 無効 ${data.invalidRows}`
      );
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 560 }}>
      <p style={{ marginBottom: 16, fontSize: 14 }}>
        CSV はヘッダー行に <code>email</code>（または mail）列が必須です。任意:{" "}
        <code>name</code>, <code>source</code>, <code>confirmed_at</code>。
        インポートした行は <strong>active / legacy_import</strong> となり、
        確認メールは送りません。
      </p>
      <form onSubmit={onSubmit}>
        <input type="file" name="file" accept=".csv,text/csv" />
        <div style={{ marginTop: 16 }}>
          <button type="submit" disabled={loading} style={{ padding: "10px 20px" }}>
            アップロード
          </button>
        </div>
      </form>
      {msg && (
        <pre
          style={{
            marginTop: 20,
            padding: 12,
            background: "#fff",
            border: "1px solid #ddd",
            whiteSpace: "pre-wrap",
          }}
        >
          {msg}
        </pre>
      )}
    </div>
  );
}
