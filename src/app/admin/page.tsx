"use client";

const PAGES: { slug: string; label: string }[] = [
  { slug: "kojin", label: "個人レッスン" },
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
      <p style={{ marginBottom: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <a
          href="/admin/edit?page=kojin"
          style={{
            display: "inline-block",
            padding: "12px 20px",
            background: "#2c2c2c",
            color: "#fff",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          カリキュラム
        </a>
        <a
          href="/admin/youtube"
          style={{
            display: "inline-block",
            padding: "12px 20px",
            background: "#2c2c2c",
            color: "#fff",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          YouTube
        </a>
        <a
          href="/admin/testimonials"
          style={{
            display: "inline-block",
            padding: "12px 20px",
            background: "#2c2c2c",
            color: "#fff",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          生徒の声
        </a>
        <a
          href="/admin/schedule"
          style={{
            display: "inline-block",
            padding: "12px 20px",
            background: "#2c2c2c",
            color: "#fff",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          講座スケジュール
        </a>
        <a
          href="/admin/analytics"
          style={{
            display: "inline-block",
            padding: "12px 20px",
            background: "#2c2c2c",
            color: "#fff",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          アクセス解析
        </a>
      </p>
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
