export default function NewsletterAdminHome() {
  if (process.env.NODE_ENV === "production") {
    console.log("[admin/newsletter] render home");
  }
  try {
    return (
      <div style={{ lineHeight: 1.8 }}>
        <ul style={{ paddingLeft: 20 }}>
          <li>
            <a href="/admin/newsletter/campaigns/new/">配信メール作成</a>
            — 件名・本文・CTA・テスト送信・即時／予約送信
          </li>
          <li>
            <a href="/admin/newsletter/scheduled/">配信予約リスト</a>
          </li>
          <li>
            <a href="/admin/newsletter/history/">配信履歴・解析</a>
          </li>
          <li>
            <a href="/admin/newsletter/subscribers/">購読者管理</a>
          </li>
          <li>
            <a href="/admin/newsletter/import/">CSVインポート</a>
            （レガシー購読者・送信確認メールなし）
          </li>
        </ul>
        <p style={{ marginTop: 16, fontSize: 13, color: "#666" }}>
          公開の登録フォームは{" "}
          <a href="/trial.html#tab04" target="_blank" rel="noreferrer">
            trial ページ タブ4
          </a>
          です。送信APIには環境変数 <code>RESEND_API_KEY</code> が必要です（ページ表示には不要）。
        </p>
      </div>
    );
  } catch (err) {
    console.error("[admin/newsletter] page error", err);
    return (
      <p style={{ color: "#b00" }}>
        表示中にエラーが発生しました。ログを確認してください。
      </p>
    );
  }
}
