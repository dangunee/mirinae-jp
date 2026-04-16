"use client";

import { useEffect, useState } from "react";

type Row = {
  id: string;
  subject: string;
  status: string;
  sentAt: string | null;
  totalTargetCount: number;
  sentCount: number;
  failedCount: number;
  uniqueOpenCount: number;
  uniqueClickCount: number;
  openCount: number;
  clickCount: number;
  createdAt: string;
};

export default function HistoryPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/admin/newsletter/campaigns?scope=history", {
        credentials: "include",
      });
      const data = await res.json();
      setItems(data.items || []);
      setLoading(false);
    })();
  }, []);

  if (loading) return <p>読み込み中…</p>;

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", minWidth: 800, borderCollapse: "collapse", background: "#fff", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "#eee", textAlign: "left" }}>
            <th style={th}>件名</th>
            <th style={th}>状態</th>
            <th style={th}>送信日時</th>
            <th style={th}>対象</th>
            <th style={th}>成功</th>
            <th style={th}>失敗</th>
            <th style={th}>開封(U)</th>
            <th style={th}>クリック(U)</th>
          </tr>
        </thead>
        <tbody>
          {items.map((r) => {
            const openRate =
              r.sentCount > 0 ? ((r.uniqueOpenCount / r.sentCount) * 100).toFixed(1) : "—";
            const clickRate =
              r.sentCount > 0 ? ((r.uniqueClickCount / r.sentCount) * 100).toFixed(1) : "—";
            return (
              <tr key={r.id} style={{ borderTop: "1px solid #ddd" }}>
                <td style={td}>{r.subject}</td>
                <td style={td}>{r.status}</td>
                <td style={td}>
                  {r.sentAt ? new Date(r.sentAt).toLocaleString("ja-JP") : "—"}
                </td>
                <td style={td}>{r.totalTargetCount}</td>
                <td style={td}>{r.sentCount}</td>
                <td style={td}>{r.failedCount}</td>
                <td style={td}>
                  {r.uniqueOpenCount} ({openRate}%)
                </td>
                <td style={td}>
                  {r.uniqueClickCount} ({clickRate}%)
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p style={{ marginTop: 12, fontSize: 12, color: "#666" }}>
        開封率は画像ピクセル計測のため目安です。クリック率はリダイレクト計測でより信頼できます。
      </p>
    </div>
  );
}

const th: React.CSSProperties = { padding: 8 };
const td: React.CSSProperties = { padding: 8 };
