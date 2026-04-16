import Link from "next/link";

export const metadata = {
  title: "配信停止｜メールマガジン｜ミリネ韓国語教室",
  robots: "noindex, nofollow",
};

export default function Page() {
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
      <h1 style={{ fontSize: 22, marginBottom: 16 }}>配信を停止しました</h1>
      <p>メールマガジンの配信を停止しました。これまでのご登録ありがとうございました。</p>
      <p>
        <Link href="/" style={{ color: "#b8912e" }}>
          トップページへ
        </Link>
      </p>
    </div>
  );
}
