"use client";

import { useState, useEffect } from "react";

const TABS = [
  { id: "shochukyu", label: "初中級" },
  { id: "chukyu1", label: "中級1" },
  { id: "chukyu2", label: "中級2" },
  { id: "jokyu", label: "上級" },
] as const;

type TabId = (typeof TABS)[number]["id"];

type CurriculumByLevel = Record<string, { id: string; levelKey: string; rowOrder: number; theme: string }[]>;

export default function KaiwaCurriculumClient() {
  const [activeTab, setActiveTab] = useState<TabId>("shochukyu");
  const [data, setData] = useState<CurriculumByLevel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/kaiwa-curriculum")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const hash = (typeof window !== "undefined" ? window.location.hash : "").replace("#", "");
    if (["shochukyu", "chukyu1", "chukyu2", "jokyu"].includes(hash)) {
      setActiveTab(hash as TabId);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.history.replaceState(null, "", `/kaiwa#${activeTab}`);
  }, [activeTab]);

  useEffect(() => {
    const onHashChange = () => {
      const h = window.location.hash.replace("#", "");
      if (["shochukyu", "chukyu1", "chukyu2", "jokyu"].includes(h)) setActiveTab(h as TabId);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const themes = data?.[activeTab] ?? [];

  return (
    <>
      <div className="tabs-bar">
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

      <div className="page-wrapper" style={{ padding: "0 24px 80px" }}>
        <div className="tab-panel">
          <div className="curriculum-section">
            <div className="curriculum-header">『{TABS.find((t) => t.id === activeTab)?.label}』</div>
            {loading ? (
              <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>読み込み中…</div>
            ) : themes.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
                データがありません。管理画面からシードを実行してください。
              </div>
            ) : (
              <div className="curriculum-list">
                {themes.map((item) => (
                  <div key={item.id} className="curriculum-item">
                    <span className="curriculum-num">{item.rowOrder}</span>
                    <span className="curriculum-theme">{item.theme}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
