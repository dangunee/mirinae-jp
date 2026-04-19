import Link from "next/link";

export const metadata = {
  title: "登録完了｜メールマガジン｜ミリネ韓国語教室",
  robots: "noindex, nofollow",
};

export default function Page({
  searchParams,
}: {
  searchParams: { already?: string };
}) {
  const already = searchParams.already === "1" || searchParams.already === "true";

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        maxWidth: 520,
        margin: "48px auto",
        padding: 24,
        lineHeight: 1.8,
      }}
    >
      <h1 style={{ fontSize: 22, marginBottom: 16 }}>
        {already ? "登録済みです" : "登録が完了しました"}
      </h1>
      <p>
        {already
          ? "このメールアドレスは既に登録されています。"
          : "ミリネ韓国語教室メールマガジンの配信をご希望いただきありがとうございます。"}
      </p>
      <p>
        <Link href="/trial.html#tab04" style={{ color: "#b8912e" }}>
          お申込みページへ戻る
        </Link>
      </p>
    </div>
  );
}
