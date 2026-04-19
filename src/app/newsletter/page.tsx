export const metadata = {
  title: "メールマガジン｜ミリネ韓国語教室",
  description: "ミリネ韓国語教室メールマガジン",
};

/** 公開トップ: /newsletter/ — クライアント境界なしで静的表示（hydration 失敗回避） */
export default function NewsletterLandingPage() {
  if (process.env.NODE_ENV === "production") {
    console.log("[newsletter] render landing");
  }
  try {
    return (
      <div
        style={{
          maxWidth: 560,
          margin: "48px auto",
          padding: 24,
          fontFamily:
            "'Hiragino Sans', 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif",
          lineHeight: 1.8,
          color: "#333",
        }}
      >
        <h1 style={{ fontSize: 22, marginBottom: 16 }}>メールマガジン</h1>
        <p>
          役に立つ韓国語情報をお届けするメールマガジンです。ご登録はお申込みページのタブ「メールマガジン」からどうぞ。
        </p>
        <p style={{ marginTop: 24 }}>
          <a
            href="/trial.html#tab04"
            style={{ color: "#b8912e", fontWeight: 600 }}
          >
            登録フォームへ（trial ページ・タブ4）
          </a>
        </p>
        <p style={{ marginTop: 16, fontSize: 13, color: "#666" }}>
          登録後、届くメールのリンクから配信を停止できます。
        </p>
      </div>
    );
  } catch (err) {
    console.error("[newsletter] page error", err);
    return (
      <div style={{ padding: 24, color: "#b00" }}>
        表示中にエラーが発生しました。
      </div>
    );
  }
}
