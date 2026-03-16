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
        justifyContent: "center",
        backgroundColor: "#f5f0e8",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "75rem",
          minHeight: "100vh",
          boxShadow: "0 0 24px rgba(0,0,0,0.08)",
        }}
      >
        <iframe
          src="https://apps.mirinae.jp/writing"
          title="作文トレーニング｜ミリネ韓国語"
          style={{
            width: "100%",
            height: "100vh",
            minHeight: "800px",
            border: "none",
            display: "block",
          }}
        />
      </div>
    </div>
  );
}
