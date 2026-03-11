"use client";

import { useState, useEffect } from "react";

type TabId = "tab01" | "tab02" | "tab03";

const TABS: { id: TabId; label: string }[] = [
  { id: "tab01", label: "作文トレーニング" },
  { id: "tab02", label: "音読トレーニング" },
  { id: "tab03", label: "TOPIKトレーニング" },
];

type Props = {
  writingUrl: string;
  ondokuUrl: string;
  topikUrl: string;
};

const NOTES = [
  "毎週のテーマ作文＋ネイティブ添削＋比較文＋模範文で、表現力をぐっと伸ばすオンライン講座です。下のフレーム内から、そのまま専用ページを操作できます。",
  "発音矯正と音読トレーニングをオンラインで行う講座です。下のフレーム内に、従来の通信音読トレーニングページをそのまま表示しています。",
  "TOPIK 作文・読解など、試験対策用の通信講座です。作文学習サイトの TOPIK タブをそのままご利用いただけます。",
];

const IFRAME_NOTES = [
  "※ 通信環境により読み込みに少し時間がかかる場合があります。表示されないときは数秒お待ちいただくか、ページを再読み込みしてください。",
  "※ 別タブで開きたい場合は、フレーム内のリンクをクリックしてください。",
  "※ 表示中の内容は、作文トレーニングサイトの TOPIK タブです。",
];

export default function NetlessonClient({
  writingUrl,
  ondokuUrl,
  topikUrl,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("tab01");

  useEffect(() => {
    const hash = (typeof window !== "undefined" ? window.location.hash : "").replace("#", "");
    if (["tab01", "tab02", "tab03"].includes(hash)) {
      setActiveTab(hash as TabId);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.history.replaceState(null, "", `/netlesson#${activeTab}`);
  }, [activeTab]);

  useEffect(() => {
    const onHashChange = () => {
      const h = window.location.hash.replace("#", "");
      if (["tab01", "tab02", "tab03"].includes(h)) setActiveTab(h as TabId);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const urls = [writingUrl, ondokuUrl, topikUrl];
  const titles = [
    "ミリネ韓国語 作文トレーニング",
    "ミリネ韓国語 通信音読トレーニング",
    "ミリネ韓国語 TOPIKトレーニング",
  ];

  return (
    <>
      <div className="tab-bar">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={`tab-btn ${activeTab === id ? "active" : ""}`}
            data-tab={id}
            onClick={() => setActiveTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {TABS.map(({ id, label }, i) => (
        <div
          key={id}
          id={id}
          className={`tab-panel ${activeTab === id ? "active" : ""}`}
          style={{ display: activeTab === id ? "block" : "none" }}
        >
          <h2 className="section-header">『{label}』</h2>
          <div className="iframe-card">
            <p className="form-note">{NOTES[i]}</p>
            <a
              href={urls[i]}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                marginBottom: 16,
                padding: "10px 20px",
                background: "var(--taupe)",
                color: "white",
                borderRadius: 8,
                textDecoration: "none",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              ▶ 専用ページで申込・操作
            </a>
            <div className="iframe-wrap">
              <iframe
                className="iframe-frame"
                title={titles[i]}
                src={activeTab === id ? urls[i] : undefined}
                loading="lazy"
              />
            </div>
            <p className="iframe-note">{IFRAME_NOTES[i]}</p>
          </div>
        </div>
      ))}
    </>
  );
}
