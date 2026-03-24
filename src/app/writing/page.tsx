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
        padding: "2rem 1.5rem",
        minHeight: "100vh",
        backgroundColor: "#f5f0e8",
      }}
    >
      <div style={{ maxWidth: "52.75rem", margin: "0 auto" }}>
        <h1
          style={{
            margin: "0 0 1rem",
            fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
            fontWeight: 700,
            color: "#2c2c2c",
          }}
        >
          作文トレーニング
        </h1>
        <p style={{ margin: 0, color: "#666", fontSize: "0.95rem" }}>
          新しいアプリのコンテンツは、このページに実装してください。
        </p>
      </div>
    </div>
  );
}
