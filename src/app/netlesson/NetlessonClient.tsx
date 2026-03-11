"use client";

import { useState, useEffect } from "react";

type TabId = "tab01" | "tab02" | "tab03";

const TABS: { id: TabId; label: string }[] = [
  { id: "tab01", label: "作文トレーニング" },
  { id: "tab02", label: "音読トレーニング" },
  { id: "tab03", label: "TOPIK Training" },
];

type Props = {
  writingUrl: string;
  ondokuUrl: string;
  topikUrl: string;
};

export default function NetlessonClient({
  writingUrl,
  ondokuUrl,
  topikUrl,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("tab01");
  const [loadedTabs, setLoadedTabs] = useState<Set<TabId>>(new Set(["tab01"]));

  useEffect(() => {
    const hash = (typeof window !== "undefined" ? window.location.hash : "").replace("#", "");
    if (["tab01", "tab02", "tab03"].includes(hash)) {
      const tab = hash as TabId;
      setActiveTab(tab);
      setLoadedTabs((prev) => new Set(prev).add(tab));
    }
  }, []);

  useEffect(() => {
    setLoadedTabs((prev) => new Set(prev).add(activeTab));
  }, [activeTab]);

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
  const notes = [
    "毎週のテーマ作文＋ネイティブ添削＋比較文＋模範文で、表現力をぐっと伸ばすオンライン講座です。下のフレーム内から、そのまま専用ページを操作できます。",
    "発音矯正と音読トレーニングをオンラインで行う講座です。下のフレーム内に、従来の通信音読トレーニングページをそのまま表示しています。",
    "TOPIK 作文・読解など、試験対策用の通信講座ページを下のフレーム内に表示しています。作文学習サイトの TOPIK タブをそのままご利用いただけます。",
  ];
  const iframeNotes = [
    "※ 通信環境により読み込みに少し時間がかかる場合があります。表示されないときは数秒お待ちいただくか、ページを再読み込みしてください。",
    "※ 別タブで開きたい場合は、フレーム内のリンクをクリックしてください。",
    "※ 表示中の内容は、作文トレーニングサイトの TOPIK タブです。",
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
            <div
              className="iframe-wrap"
              style={{
                borderRadius: 8,
                overflow: "hidden",
                border: "1px solid var(--gray-border)",
                background: "#f5f5f5",
                marginBottom: 12,
              }}
            >
              <iframe
                className="iframe-frame"
                title={`ミリネ韓国語 ${label}`}
                loading="lazy"
                src={loadedTabs.has(id) ? urls[i] : undefined}
                data-src={urls[i]}
                style={{
                  display: "block",
                  width: "100%",
                  height: 1400,
                  border: 0,
                  background: "white",
                }}
              />
            </div>
            <p className="iframe-note" style={{ fontSize: 12, color: "var(--text-muted)" }}>
              {iframeNotes[i]}
            </p>
          </div>
        </div>
      ))}
    </>
  );
}
