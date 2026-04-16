import { NewsletterNav } from "./NewsletterNav";

export default function NewsletterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (process.env.NODE_ENV === "production") {
    console.log("[admin/newsletter] layout render");
  }
  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>メール配信</h1>
      <p style={{ color: "#555", marginBottom: 16, fontSize: 14 }}>
        メールマガジン購読者・一斉配信の管理（Resend 経由で送信）。
      </p>
      <NewsletterNav />
      {children}
    </div>
  );
}
