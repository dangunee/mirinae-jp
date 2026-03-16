import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "作文トレーニング｜ミリネ韓国語",
  description:
    "毎週のテーマ作文＋ネイティブ添削＋比較文＋模範文で、表現力をぐっと伸ばすオンライン講座です。",
};

export default function WritingPage() {
  return (
    <div style={{ margin: 0, padding: 0, height: "100vh", overflow: "hidden" }}>
      <iframe
        src="https://apps.mirinae.jp/writing"
        title="作文トレーニング｜ミリネ韓国語"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
        }}
      />
    </div>
  );
}
