export const metadata = {
  robots: "noindex, nofollow",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh" }}>
      <header style={{ background: "#3d6b6b", color: "#fff", padding: "12px 24px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <span style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "8px 20px" }}>
          <a href="/" style={{ color: "#fff", textDecoration: "none", fontWeight: 600 }}>www.mirinae.jp</a>
          <a href="/admin" style={{ color: "rgba(255,255,255,0.9)", textDecoration: "none" }}>管理</a>
          <a href="/admin/newsletter" style={{ color: "rgba(255,255,255,0.9)", textDecoration: "none", fontSize: 14 }}>メール配信</a>
          <a href="/api/admin/logout" style={{ color: "rgba(255,255,255,0.85)", textDecoration: "none", fontSize: 14 }}>ログアウト</a>
          <span style={{ opacity: 0.9, fontSize: 14 }}>ホームページ表データの編集</span>
        </span>
        <a href="/" style={{ color: "#fff", textDecoration: "none", fontSize: 14, padding: "6px 14px", border: "1px solid rgba(255,255,255,0.8)", borderRadius: 6 }}>ホームページへ</a>
      </header>
      <main style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>{children}</main>
    </div>
  );
}
