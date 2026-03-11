"use client";

import { useState, useEffect } from "react";

type TabId = "tab01" | "tab02" | "tab03";

const TABS: { id: TabId; label: string }[] = [
  { id: "tab01", label: "作文トレーニング" },
  { id: "tab02", label: "音読トレーニング" },
  { id: "tab03", label: "TOPIK Training" },
];

type Props = {
  writingHtml: string;
  ondokuHtml: string;
  topikHtml: string;
  writingUrl: string;
  ondokuUrl: string;
  topikUrl: string;
};

export default function NetlessonClient({
  writingHtml,
  ondokuHtml,
  topikHtml,
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

  const contents = [
    { html: writingHtml, url: writingUrl },
    { html: ondokuHtml, url: ondokuUrl },
    { html: topikHtml, url: topikUrl },
  ];

  const notes = [
    "毎週のテーマ作文＋ネイティブ添削＋比較文＋模範文で、表現力をぐっと伸ばすオンライン講座です。下のコンテンツはISRで取得し、外部CSSでデザインを適用しています。",
    "発音矯正と音読トレーニングをオンラインで行う講座です。下のコンテンツはISRで取得し、外部CSSでデザインを適用しています。",
    "TOPIK 作文・読解など、試験対策用の通信講座です。下のコンテンツはISRで取得し、外部CSSでデザインを適用しています。",
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
            <p className="form-note">{notes[i]}</p>
            <a
              href={contents[i].url}
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
            <div
              className="embed-content"
              dangerouslySetInnerHTML={{ __html: contents[i].html }}
              style={{
                maxHeight: 1200,
                overflowY: "auto",
                padding: 16,
                background: "#fff",
                borderRadius: 8,
                border: "1px solid var(--gray-border)",
              }}
            />
            <p className="iframe-note" style={{ marginTop: 12, fontSize: 12, color: "var(--text-muted)" }}>
              ※ 上記はサーバーサイドで取得したコンテンツです（ISR: 60秒ごとに更新）。申込・フォーム操作は専用ページをご利用ください。
            </p>
          </div>
        </div>
      ))}
    </>
  );
}
