"use client";

import { useEffect, useState } from "react";

type Sub = {
  id: string;
  email: string;
  name: string | null;
  status: string;
  source: string;
  confirmedAt: string | null;
  createdAt: string;
};

export default function SubscribersPage() {
  const [items, setItems] = useState<Sub[]>([]);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const params = new URLSearchParams({ take: "100", skip: "0" });
    if (q.trim()) params.set("q", q.trim());
    const res = await fetch(`/api/admin/newsletter/subscribers?${params}`, {
      credentials: "include",
    });
    const data = await res.json();
    setItems(data.items || []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="メールで検索"
          style={{ padding: 8, minWidth: 220 }}
        />
        <button type="button" onClick={() => void load()} style={{ padding: "8px 16px" }}>
          検索
        </button>
      </div>
      {loading ? (
        <p>読み込み中…</p>
      ) : (
        <>
          <p style={{ fontSize: 14, marginBottom: 8 }}>件数: {total}</p>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#eee", textAlign: "left" }}>
                <th style={th}>メール</th>
                <th style={th}>状態</th>
                <th style={th}>source</th>
                <th style={th}>確認日</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id} style={{ borderTop: "1px solid #ddd" }}>
                  <td style={td}>{r.email}</td>
                  <td style={td}>{r.status}</td>
                  <td style={td}>{r.source}</td>
                  <td style={td}>
                    {r.confirmedAt ? new Date(r.confirmedAt).toLocaleDateString("ja-JP") : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

const th: React.CSSProperties = { padding: 8 };
const td: React.CSSProperties = { padding: 8 };
