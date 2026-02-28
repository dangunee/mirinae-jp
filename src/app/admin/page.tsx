"use client";

const PAGES: { slug: string; label: string }[] = [
  { slug: "kojin", label: "個人レッスン（短期集中カリキュラム）" },
  { slug: "group", label: "グループ" },
  { slug: "kaiwa", label: "会話" },
  { slug: "special", label: "試験対策" },
  { slug: "syutyu", label: "集中講座" },
  { slug: "trial", label: "通信講座" },
  { slug: "book", label: "著書" },
];

export default function AdminPage() {
  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 24 }}>編集するページを選んでください</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {PAGES.map((p) => (
          <li key={p.slug} style={{ marginBottom: 12 }}>
            <a
              href={`/admin/edit?page=${p.slug}`}
              style={{
                display: "block",
                padding: "16px 20px",
                background: "#fff",
                borderRadius: 8,
                textDecoration: "none",
                color: "#2c2c2c",
                border: "1px solid #e5e5e5",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              {p.label}
            </a>
          </li>
        ))}
      </ul>
      <p style={{ marginTop: 24, fontSize: 14, color: "#666" }}>
        表データはデータベース（퀴즈앱과同一の Supabase）に保存されます。
      </p>
    </div>
  );
}
