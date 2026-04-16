import Link from "next/link";

export const metadata = {
  title: "エラー｜メールマガジン｜ミリネ韓国語教室",
  robots: "noindex, nofollow",
};

export default function Page({
  searchParams,
}: {
  searchParams: { e?: string };
}) {
  const e = searchParams.e;
  const msg =
    e === "expired"
      ? "リンクの有効期限が切れているか、無効です。"
      : e === "invalid"
        ? "無効なリンクです。"
        : "処理を完了できませんでした。";

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
      <h1 style={{ fontSize: 22, marginBottom: 16 }}>エラー</h1>
      <p>{msg}</p>
      <p>
        <Link href="/trial.html#tab03" style={{ color: "#b8912e" }}>
          お申込みページへ戻る
        </Link>
      </p>
    </div>
  );
}
