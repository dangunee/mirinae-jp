import Link from "next/link";

export default function NewsletterAdminHome() {
  return (
    <div style={{ lineHeight: 1.8 }}>
      <ul style={{ paddingLeft: 20 }}>
        <li>
          <Link href="/admin/newsletter/campaigns/new">配信メール作成</Link>
          — 件名・本文・CTA・テスト送信・即時／予約送信
        </li>
        <li>
          <Link href="/admin/newsletter/scheduled">配信予約リスト</Link>
        </li>
        <li>
          <Link href="/admin/newsletter/history">配信履歴・解析</Link>
        </li>
        <li>
          <Link href="/admin/newsletter/subscribers">購読者管理</Link>
        </li>
        <li>
          <Link href="/admin/newsletter/import">CSVインポート</Link>（レガシー購読者・送信確認メールなし）
        </li>
      </ul>
      <p style={{ marginTop: 16, fontSize: 13, color: "#666" }}>
        公開の登録フォームは{" "}
        <a href="/trial.html#tab03" target="_blank" rel="noreferrer">
          trial ページ タブ3
        </a>
        です。環境変数 <code>RESEND_API_KEY</code> 必須。
      </p>
    </div>
  );
}
