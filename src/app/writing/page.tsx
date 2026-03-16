import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "作文トレーニング｜ミリネ韓国語",
  description:
    "毎週のテーマ作文＋ネイティブ添削＋比較文＋模範文で、表現力をぐっと伸ばすオンライン講座です。",
};

export default function WritingPage() {
  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#f5f0e8",
      }}
    >
      <header
        style={{
          width: "100%",
          maxWidth: "52.75rem",
          backgroundColor: "#146382",
          color: "white",
          padding: "1rem 1.5rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(1.5rem, 4vw, 2.7rem)",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textAlign: "center",
          }}
        >
          ミリネ韓国語教室 作文講座
        </h1>
      </header>
      <div
        style={{
          width: "100%",
          maxWidth: "52.75rem",
          flex: 1,
          minHeight: 0,
          boxShadow: "0 0 24px rgba(0,0,0,0.08)",
        }}
      >
        <iframe
          src="https://apps.mirinae.jp/writing"
          title="作文トレーニング｜ミリネ韓国語"
          style={{
            width: "100%",
            height: "calc(100vh - 5rem)",
            minHeight: "800px",
            border: "none",
            display: "block",
          }}
        />
      </div>
    </div>
  );
}
