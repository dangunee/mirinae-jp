"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import type {
  CurriculumBlock,
  CurriculumRow,
  CurriculumTheme,
} from "@/app/api/curriculum/route";

const PAGE_LABELS: Record<string, string> = {
  kojin: "個人レッスン",
  group: "グループ",
  kaiwa: "会話",
  special: "試験対策",
  syutyu: "集中講座",
  trial: "通信講座",
  book: "著書",
};

/** テーマ列を表示するブロック（コマ・12/24/48＋テーマのカリキュラム） */
const CURRICULUM_WITH_THEME_KEYS = ["curriculum_shokyu", "curriculum_chukyu", "curriculum_jokyu"];

function EditContent() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "kojin";
  const [blocks, setBlocks] = useState<CurriculumBlock[]>([]);
  const [themes, setThemes] = useState<CurriculumTheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingThemes, setSavingThemes] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<CurriculumBlock | null>(null);
  const [dirty, setDirty] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [showThemes, setShowThemes] = useState(false);

  // 初級→中級→上級の順
  const KOJIN_BLOCK_ORDER = ["curriculum_shokyu", "curriculum_chukyu", "curriculum_jokyu"];

  useEffect(() => {
    const load = async () => {
      const [blocksRes, themesRes] = await Promise.all([
        fetch(`/api/curriculum?page=${page}`),
        page === "kojin" ? fetch("/api/curriculum/themes") : null,
      ]);
      const blocksData = await blocksRes.json();
      const list = Array.isArray(blocksData) ? blocksData : [];
      const sorted =
        page === "kojin"
          ? [...list].sort(
              (a: CurriculumBlock, b: CurriculumBlock) =>
                KOJIN_BLOCK_ORDER.indexOf(a.blockKey) - KOJIN_BLOCK_ORDER.indexOf(b.blockKey)
            )
          : list;
      setBlocks(sorted);
      if (sorted[0]) setSelectedBlock(sorted[0]);
      if (themesRes?.ok) {
        const t = await themesRes.json();
        setThemes(Array.isArray(t) ? t : []);
      }
      setLoading(false);
    };
    load();
  }, [page]);

  const updateRow = (blockId: string, rowIndex: number, col: keyof CurriculumRow, value: string) => {
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== blockId) return b;
        const rows = [...b.rows];
        if (!rows[rowIndex]) return b;
        rows[rowIndex] = { ...rows[rowIndex], [col]: value };
        return { ...b, rows };
      })
    );
    setSelectedBlock((b) => {
      if (!b || b.id !== blockId) return b;
      const rows = [...b.rows];
      if (!rows[rowIndex]) return b;
      rows[rowIndex] = { ...rows[rowIndex], [col]: value };
      return { ...b, rows };
    });
    setDirty(true);
  };

  const showThemeColumns =
    selectedBlock && CURRICULUM_WITH_THEME_KEYS.includes(selectedBlock.blockKey);

  const updateTheme = (index: number, field: keyof CurriculumTheme, value: string) => {
    setThemes((prev) => {
      const next = [...prev];
      if (!next[index]) return prev;
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };
  const addTheme = () => {
    setThemes((prev) => [
      ...prev,
      { slug: `theme_${Date.now()}`, name: "新規", color: "#333", bgColor: "#f0f0f0" },
    ]);
  };
  const removeTheme = (index: number) => {
    setThemes((prev) => prev.filter((_, i) => i !== index));
  };
  const saveThemes = async () => {
    setSavingThemes(true);
    try {
      await fetch("/api/curriculum/themes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(themes),
      });
    } finally {
      setSavingThemes(false);
    }
  };

  const save = async () => {
    if (!selectedBlock) return;
    setSaving(true);
    try {
      await fetch("/api/curriculum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedBlock.id,
          pageSlug: selectedBlock.pageSlug,
          blockKey: selectedBlock.blockKey,
          title: selectedBlock.title,
          rows: selectedBlock.rows,
        }),
      });
      setDirty(false);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>読み込み中…</p>;

  return (
    <div>
      <p style={{ marginBottom: 16 }}>
        <a href="/admin" style={{ color: "#4a6fa5" }}>← 一覧</a>
        <span style={{ marginLeft: 16 }}>{PAGE_LABELS[page] ?? page}</span>
      </p>

      {blocks.length === 0 ? (
        <div style={{ color: "#666" }}>
          <p>このページにはまだ表データがありません。</p>
          {page === "kojin" && (
            <button
              onClick={async () => {
                setSeeding(true);
                try {
                  const r = await fetch("/api/seed/kojin", { method: "POST" });
                  const j = await r.json();
                  if (r.ok) {
                    const res = await fetch(`/api/curriculum?page=kojin`);
                    const data = await res.json();
                    setBlocks(Array.isArray(data) ? data : []);
                    if (data[0]) setSelectedBlock(data[0]);
                  } else alert(j.error || "失敗");
                } finally {
                  setSeeding(false);
                }
              }}
              disabled={seeding}
              style={{ marginTop: 12, padding: "10px 20px", cursor: "pointer", borderRadius: 8, border: "1px solid #3d6b6b", background: "#fff", color: "#3d6b6b" }}
            >
              {seeding ? "登録中…" : "個人レッスン 初級・中級・上級の初期データを登録"}
            </button>
          )}
        </div>
      ) : (
        <>
          {page === "kojin" && (
            <div style={{ marginBottom: 24 }}>
              <button
                type="button"
                onClick={() => setShowThemes(!showThemes)}
                style={{
                  padding: "8px 16px",
                  border: "1px solid #3d6b6b",
                  borderRadius: 6,
                  background: showThemes ? "#e8f0f0" : "#fff",
                  color: "#3d6b6b",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                {showThemes ? "▼ テーマ管理を閉じる" : "▶ テーマ管理（発音・文法・語彙などの色）"}
              </button>
              {showThemes && (
                <div
                  style={{
                    marginTop: 12,
                    padding: 16,
                    border: "1px solid #e0e0e0",
                    borderRadius: 8,
                    background: "#fafafa",
                  }}
                >
                  <p style={{ fontSize: 12, color: "#666", marginBottom: 12 }}>
                    短期集中カリキュラムのタグ（発音・文法・語彙など）の表示名と色を設定します。
                  </p>
                  {themes.map((t, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="slug"
                        value={t.slug}
                        onChange={(e) => updateTheme(i, "slug", e.target.value)}
                        style={{ width: 100, padding: "6px 8px", fontSize: 12 }}
                      />
                      <input
                        type="text"
                        placeholder="表示名"
                        value={t.name}
                        onChange={(e) => updateTheme(i, "name", e.target.value)}
                        style={{ width: 120, padding: "6px 8px", fontSize: 12 }}
                      />
                      <label style={{ fontSize: 12 }}>
                        文字色
                        <input
                          type="color"
                          value={t.color}
                          onChange={(e) => updateTheme(i, "color", e.target.value)}
                          style={{ marginLeft: 4, width: 28, height: 28, padding: 0, border: "1px solid #ccc" }}
                        />
                        <input
                          type="text"
                          value={t.color}
                          onChange={(e) => updateTheme(i, "color", e.target.value)}
                          style={{ width: 70, marginLeft: 4, padding: "4px 6px", fontSize: 11 }}
                        />
                      </label>
                      <label style={{ fontSize: 12 }}>
                        背景色
                        <input
                          type="color"
                          value={t.bgColor}
                          onChange={(e) => updateTheme(i, "bgColor", e.target.value)}
                          style={{ marginLeft: 4, width: 28, height: 28, padding: 0, border: "1px solid #ccc" }}
                        />
                        <input
                          type="text"
                          value={t.bgColor}
                          onChange={(e) => updateTheme(i, "bgColor", e.target.value)}
                          style={{ width: 70, marginLeft: 4, padding: "4px 6px", fontSize: 11 }}
                        />
                      </label>
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: 4,
                          fontSize: 12,
                          background: t.bgColor,
                          color: t.color,
                          border: "1px solid #ddd",
                        }}
                      >
                        {t.name || t.slug}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeTheme(i)}
                        style={{
                          padding: "4px 10px",
                          fontSize: 12,
                          border: "1px solid #c00",
                          background: "#fff",
                          color: "#c00",
                          cursor: "pointer",
                          borderRadius: 4,
                        }}
                      >
                        削除
                      </button>
                    </div>
                  ))}
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <button
                      type="button"
                      onClick={addTheme}
                      style={{
                        padding: "8px 16px",
                        border: "1px solid #3d6b6b",
                        borderRadius: 6,
                        background: "#fff",
                        color: "#3d6b6b",
                        cursor: "pointer",
                        fontSize: 13,
                      }}
                    >
                      ＋ テーマを追加
                    </button>
                    <button
                      type="button"
                      onClick={saveThemes}
                      disabled={savingThemes}
                      style={{
                        padding: "8px 16px",
                        border: "none",
                        borderRadius: 6,
                        background: "#3d6b6b",
                        color: "#fff",
                        cursor: savingThemes ? "wait" : "pointer",
                        fontSize: 13,
                      }}
                    >
                      {savingThemes ? "保存中…" : "テーマを保存"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            {blocks.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBlock(b)}
                style={{
                  padding: "8px 16px",
                  border: selectedBlock?.id === b.id ? "2px solid #3d6b6b" : "1px solid #ddd",
                  borderRadius: 6,
                  background: selectedBlock?.id === b.id ? "#e8f0f0" : "#fff",
                  cursor: "pointer",
                }}
              >
                {b.title || b.blockKey}
              </button>
            ))}
          </div>

          {selectedBlock && (
            <>
              <div style={{ overflowX: "auto", marginBottom: 16, minWidth: 0 }}>
                <table style={{ width: "100%", minWidth: showThemeColumns ? 1100 : 960, borderCollapse: "collapse", background: "#fff", border: "1px solid #d0d0d0", tableLayout: "fixed" }}>
                  <colgroup>
                    <col style={{ width: "56px" }} />
                    {showThemeColumns && <col style={{ width: "100px" }} />}
                    <col />
                    {showThemeColumns && <col style={{ width: "100px" }} />}
                    <col />
                    {showThemeColumns && <col style={{ width: "100px" }} />}
                    <col />
                  </colgroup>
                  <thead>
                    <tr style={{ background: "#3d6b6b", color: "#fff" }}>
                      <th style={thStyle}>コマ</th>
                      {showThemeColumns && <th style={thStyle}>12テーマ</th>}
                      <th style={thStyle}>12コマ</th>
                      {showThemeColumns && <th style={thStyle}>24テーマ</th>}
                      <th style={thStyle}>24コマ</th>
                      {showThemeColumns && <th style={thStyle}>48テーマ</th>}
                      <th style={thStyle}>48コマ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedBlock.rows.map((row, i) => (
                      <tr key={i}>
                        <td style={tdKomaStyle}>
                          <input
                            type="text"
                            value={row.koma}
                            onChange={(e) => updateRow(selectedBlock.id, i, "koma", e.target.value)}
                            style={inputKomaStyle}
                          />
                        </td>
                        {showThemeColumns && (
                          <td style={tdStyle}>
                            <select
                              value={row.theme12 ?? ""}
                              onChange={(e) =>
                                updateRow(selectedBlock.id, i, "theme12", e.target.value)
                              }
                              style={{ width: "100%", padding: "6px 8px", fontSize: 13 }}
                            >
                              <option value="">—</option>
                              {themes.map((t) => (
                                <option key={t.slug} value={t.slug}>
                                  {t.name || t.slug}
                                </option>
                              ))}
                            </select>
                          </td>
                        )}
                        <td style={tdStyle}>
                          <input
                            type="text"
                            value={row.c12}
                            onChange={(e) => updateRow(selectedBlock.id, i, "c12", e.target.value)}
                            style={inputStyle}
                          />
                        </td>
                        {showThemeColumns && (
                          <td style={tdStyle}>
                            <select
                              value={row.theme24 ?? ""}
                              onChange={(e) =>
                                updateRow(selectedBlock.id, i, "theme24", e.target.value)
                              }
                              style={{ width: "100%", padding: "6px 8px", fontSize: 13 }}
                            >
                              <option value="">—</option>
                              {themes.map((t) => (
                                <option key={t.slug} value={t.slug}>
                                  {t.name || t.slug}
                                </option>
                              ))}
                            </select>
                          </td>
                        )}
                        <td style={tdStyle}>
                          <input
                            type="text"
                            value={row.c24}
                            onChange={(e) => updateRow(selectedBlock.id, i, "c24", e.target.value)}
                            style={inputStyle}
                          />
                        </td>
                        {showThemeColumns && (
                          <td style={tdStyle}>
                            <select
                              value={row.theme48 ?? ""}
                              onChange={(e) =>
                                updateRow(selectedBlock.id, i, "theme48", e.target.value)
                              }
                              style={{ width: "100%", padding: "6px 8px", fontSize: 13 }}
                            >
                              <option value="">—</option>
                              {themes.map((t) => (
                                <option key={t.slug} value={t.slug}>
                                  {t.name || t.slug}
                                </option>
                              ))}
                            </select>
                          </td>
                        )}
                        <td style={tdStyle}>
                          <input
                            type="text"
                            value={row.c48}
                            onChange={(e) => updateRow(selectedBlock.id, i, "c48", e.target.value)}
                            style={inputStyle}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                onClick={save}
                disabled={saving || !dirty}
                style={{
                  padding: "10px 24px",
                  background: dirty ? "#3d6b6b" : "#ccc",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  cursor: dirty && !saving ? "pointer" : "not-allowed",
                }}
              >
                {saving ? "保存中…" : "保存"}
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = { padding: "10px 12px", textAlign: "left", border: "1px solid #d0d0d0" };
const tdStyle: React.CSSProperties = { padding: 6, border: "1px solid #d0d0d0", verticalAlign: "top" };
const tdKomaStyle: React.CSSProperties = { padding: 6, border: "1px solid #d0d0d0", width: 56, verticalAlign: "top" };
const inputStyle: React.CSSProperties = { width: "100%", minHeight: 36, padding: "8px 10px", border: "1px solid #ddd", borderRadius: 4, boxSizing: "border-box", fontSize: 14 };
const inputKomaStyle: React.CSSProperties = { width: "100%", minHeight: 36, padding: "8px 6px", border: "1px solid #ddd", borderRadius: 4, boxSizing: "border-box", fontSize: 14 };

export default function EditPage() {
  return (
    <Suspense fallback={<p>読み込み中…</p>}>
      <EditContent />
    </Suspense>
  );
}
