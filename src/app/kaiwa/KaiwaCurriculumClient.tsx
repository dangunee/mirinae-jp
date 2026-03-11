"use client";

import { useState, useEffect } from "react";

const LEVELS = [
  { id: "beg", blockKey: "curriculum_shokyu", label: "初級" },
  { id: "int", blockKey: "curriculum_chukyu", label: "中級" },
  { id: "adv", blockKey: "curriculum_jokyu", label: "上級" },
] as const;

const COLS = ["12", "24", "48"] as const;

type CurriculumRow = {
  koma: string;
  c12: string;
  c24: string;
  c48: string;
  theme12?: string;
  theme24?: string;
  theme48?: string;
};

type CurriculumBlock = {
  blockKey: string;
  title: string | null;
  rows: CurriculumRow[];
};

type Theme = { slug: string; name: string; color: string; bgColor: string };

export default function KaiwaCurriculumClient() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [colIndex, setColIndex] = useState(0);
  const [blocks, setBlocks] = useState<CurriculumBlock[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/curriculum?page=kaiwa").then((r) => r.json()),
      fetch("/api/curriculum/themes").then((r) => r.json()),
    ])
      .then(([blocksData, themesData]) => {
        setBlocks(Array.isArray(blocksData) ? blocksData : []);
        setThemes(Array.isArray(themesData) ? themesData : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const level = LEVELS[levelIndex];
  const block = blocks.find((b) => b.blockKey === level?.blockKey);
  const col = COLS[colIndex];
  const themeBySlug = Object.fromEntries(themes.map((t) => [t.slug, t]));

  const rows =
    block?.rows?.filter((r) => {
      const c = r[`c${col}` as keyof CurriculumRow] as string;
      return c && String(c).replace(/\s/g, "") !== "" && c !== "-";
    }) ?? [];

  return (
    <>
      <div className="tabs-bar">
        {LEVELS.map((l, i) => (
          <button
            key={l.id}
            type="button"
            className={`tab-btn ${levelIndex === i ? "active" : ""}`}
            onClick={() => setLevelIndex(i)}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className="page-wrapper" style={{ padding: "0 24px 80px" }}>
        <div className="tab-panel">
          <div className="kaiwa-course-tabs">
            {COLS.map((c, i) => (
              <button
                key={c}
                type="button"
                className={`kaiwa-course-tab ${colIndex === i ? "active" : ""}`}
                onClick={() => setColIndex(i)}
              >
                {c}コマ
              </button>
            ))}
          </div>

          <div className="curriculum-section">
            <div className="curriculum-header">
              コマ — 内容（{col}コマコース）
            </div>
            {loading ? (
              <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>読み込み中…</div>
            ) : !block ? (
              <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
                データがありません。管理画面からシードを実行してください。
              </div>
            ) : (
              <div className="curriculum-list">
                {rows.map((row, i) => {
                  const content = (row[`c${col}` as keyof CurriculumRow] as string) || "";
                  const themeSlug = row[`theme${col}` as keyof CurriculumRow] as string | undefined;
                  const theme = themeSlug ? themeBySlug[themeSlug] : null;
                  const isEnd = String(content).indexOf("修了") !== -1;
                  return (
                    <div
                      key={i}
                      className={`curriculum-item ${isEnd ? "milestone" : ""}`}
                    >
                      <span className="curriculum-num">{row.koma}</span>
                      <span className="curriculum-theme">
                        {theme && (
                          <span
                            className="curriculum-tag"
                            style={{
                              background: theme.bgColor || "#f0f0f0",
                              color: theme.color || "#333",
                              padding: "2px 8px",
                              borderRadius: 4,
                              fontSize: 12,
                              marginRight: 8,
                            }}
                          >
                            {theme.name}
                          </span>
                        )}
                        {content}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
