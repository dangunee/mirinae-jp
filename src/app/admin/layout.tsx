export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh" }}>
      <header style={{ background: "#3d6b6b", color: "#fff", padding: "12px 24px" }}>
        <a href="/" style={{ color: "#fff", textDecoration: "none", fontWeight: 600 }}>www.mirinae.jp</a>
        <a href="/admin" style={{ color: "rgba(255,255,255,0.9)", textDecoration: "none", marginLeft: "20px" }}>管理</a>
        <span style={{ marginLeft: "16px", opacity: 0.9 }}>ホームページ表データの編集</span>
      </header>
      <main style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>{children}</main>
    </div>
  );
}
