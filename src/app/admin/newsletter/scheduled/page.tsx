"use client";

import { useEffect, useState } from "react";

type Row = {
  id: string;
  subject: string;
  status: string;
  scheduledAt: string | null;
  totalTargetCount: number;
  sentCount: number;
  createdAt: string;
};

export default function ScheduledPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/admin/newsletter/campaigns?scope=scheduled", {
        credentials: "include",
      });
      const data = await res.json();
      setItems(data.items || []);
      setLoading(false);
    })();
  }, []);

  async function cancel(id: string, status: string) {
    if (status !== "scheduled") {
      alert("送信中のキャンペーンはここからキャンセルできません。");
      return;
    }
    if (!confirm("この予約をキャンセルしますか？")) return;
    const res = await fetch(`/api/admin/newsletter/campaigns/${id}/cancel`, {
      method: "POST",
      credentials: "include",
    });
    if (res.ok) {
      setItems((prev) => prev.filter((x) => x.id !== id));
    }
  }

  if (loading) return <p>読み込み中…</p>;

  return (
    <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
      <thead>
        <tr style={{ background: "#eee", textAlign: "left" }}>
          <th style={th}>件名</th>
          <th style={th}>状態</th>
          <th style={th}>予約日時</th>
          <th style={th}>対象数</th>
          <th style={th} />
        </tr>
      </thead>
      <tbody>
        {items.map((r) => (
          <tr key={r.id} style={{ borderTop: "1px solid #ddd" }}>
            <td style={td}>{r.subject}</td>
            <td style={td}>{r.status}</td>
            <td style={td}>
              {r.scheduledAt ? new Date(r.scheduledAt).toLocaleString("ja-JP") : "—"}
            </td>
            <td style={td}>{r.totalTargetCount}</td>
            <td style={td}>
              <button
                type="button"
                onClick={() => void cancel(r.id, r.status)}
                style={{ cursor: "pointer" }}
                disabled={r.status === "sending"}
              >
                キャンセル
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const th: React.CSSProperties = { padding: 10, fontSize: 13 };
const td: React.CSSProperties = { padding: 10, fontSize: 14 };
