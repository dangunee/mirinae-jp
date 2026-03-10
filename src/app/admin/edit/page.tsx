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

type MainTab = "kojin" | "tanki" | "hatsuon" | "leveltest";
const MAIN_TABS: { id: MainTab; label: string }[] = [
  { id: "kojin", label: "個人レッスン" },
  { id: "tanki", label: "短期集中個人" },
  { id: "hatsuon", label: "発音矯正" },
  { id: "leveltest", label: "レベルテスト" },
];

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
  const [mainTab, setMainTab] = useState<MainTab>("tanki");
  const [showThemes, setShowThemes] = useState(false);
  const [checkedRows, setCheckedRows] = useState<Set<number>>(new Set());

  // 初級→中級→上級の順
  const KOJIN_BLOCK_ORDER = ["curriculum_shokyu", "curriculum_chukyu", "curriculum_jokyu"];
  const curriculumBlocks =
    page === "kojin"
      ? blocks.filter((b) => CURRICULUM_WITH_THEME_KEYS.includes(b.blockKey))
      : blocks;

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
      if (page === "kojin") {
        const curriculum = sorted.filter((b: CurriculumBlock) =>
          CURRICULUM_WITH_THEME_KEYS.includes(b.blockKey)
        );
        if (curriculum[0]) setSelectedBlock(curriculum[0]);
      } else if (sorted[0]) setSelectedBlock(sorted[0]);
      if (themesRes?.ok) {
        const t = await themesRes.json();
        setThemes(Array.isArray(t) ? t : []);
      }
      setLoading(false);
    };
    load();
  }, [page]);

  useEffect(() => {
    setCheckedRows(new Set());
  }, [selectedBlock?.id]);

  const toggleCheckRow = (index: number) => {
    setCheckedRows((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

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

  const addRow = () => {
    if (!selectedBlock) return;
    const newRow: CurriculumRow = {
      koma: "",
      c12: "",
      c24: "",
      c48: "",
      theme12: "",
      theme24: "",
      theme48: "",
    };
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== selectedBlock.id) return b;
        return { ...b, rows: [...b.rows, newRow] };
      })
    );
    setSelectedBlock((b) => {
      if (!b || b.id !== selectedBlock.id) return b;
      return { ...b, rows: [...b.rows, newRow] };
    });
    setDirty(true);
  };

  const removeCheckedRows = () => {
    if (!selectedBlock) return;
    if (checkedRows.size === 0) return;
    const remaining = selectedBlock.rows.filter((_, i) => !checkedRows.has(i));
    if (remaining.length === 0) return;
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== selectedBlock.id) return b;
        return { ...b, rows: remaining };
      })
    );
    setSelectedBlock((b) => {
      if (!b || b.id !== selectedBlock.id) return b;
      return { ...b, rows: remaining };
    });
    setCheckedRows(new Set());
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
          {page === "group" && (
            <button
              onClick={async () => {
                setSeeding(true);
                try {
                  const r = await fetch("/api/seed/group-chubu", { method: "POST" });
                  const j = await r.json();
                  if (r.ok) {
                    const res = await fetch(`/api/curriculum?page=group`);
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
              {seeding ? "登録中…" : "中級文法カリキュラム（日程付き）を登録"}
            </button>
          )}
        </div>
      ) : page === "kojin" ? (
        <>
          <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: "1px solid #e0e0e0" }}>
            {MAIN_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setMainTab(tab.id)}
                style={{
                  padding: "10px 20px",
                  border: "none",
                  borderBottom: mainTab === tab.id ? "2px solid #3d6b6b" : "2px solid transparent",
                  background: "none",
                  color: mainTab === tab.id ? "#3d6b6b" : "#666",
                  fontWeight: mainTab === tab.id ? 600 : 400,
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {mainTab === "tanki" ? (
            <div style={{ width: "100%" }}>
              <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
                {curriculumBlocks.map((b) => (
                  <button
                    key={b.id}
                    type="button"
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
                <div style={{ marginLeft: "auto", position: "relative" }}>
                  <button
                    type="button"
                    onClick={() => setShowThemes(!showThemes)}
                    style={{
                      padding: "10px 14px",
                      border: "1px solid #ccc",
                      borderRadius: 6,
                      background: "#f5f5f5",
                      color: "#333",
                      cursor: "pointer",
                      fontWeight: 500,
                      fontSize: 13,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span>テーマの色（タグの色）</span>
                    <span>{showThemes ? "▲" : "▼"}</span>
                  </button>
                  {showThemes && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        right: 0,
                        marginTop: 8,
                        padding: 14,
                        border: "1px solid #e0e0e0",
                        borderRadius: 8,
                        background: "#fafafa",
                        minWidth: 280,
                        zIndex: 10,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    >
                      <p style={{ fontSize: 11, color: "#666", marginBottom: 10 }}>
                        表示名と文字色・背景色を設定
                      </p>
                      {themes.map((t, i) => (
                        <div key={i} style={{ marginBottom: 12, fontSize: 12 }}>
                          <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                            <input
                              type="text"
                              placeholder="slug"
                              value={t.slug}
                              onChange={(e) => updateTheme(i, "slug", e.target.value)}
                              style={{ width: 70, padding: "4px 6px" }}
                            />
                            <input
                              type="text"
                              placeholder="表示名"
                              value={t.name}
                              onChange={(e) => updateTheme(i, "name", e.target.value)}
                              style={{ flex: 1, padding: "4px 6px" }}
                            />
                          </div>
                          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                            <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
                              <input
                                type="color"
                                value={t.color}
                                onChange={(e) => updateTheme(i, "color", e.target.value)}
                                style={{ width: 24, height: 24, padding: 0, border: "1px solid #ccc" }}
                              />
                              <input
                                type="text"
                                value={t.color}
                                onChange={(e) => updateTheme(i, "color", e.target.value)}
                                style={{ width: 58, padding: "2px 4px", fontSize: 11 }}
                              />
                            </label>
                            <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
                              <input
                                type="color"
                                value={t.bgColor}
                                onChange={(e) => updateTheme(i, "bgColor", e.target.value)}
                                style={{ width: 24, height: 24, padding: 0, border: "1px solid #ccc" }}
                              />
                              <input
                                type="text"
                                value={t.bgColor}
                                onChange={(e) => updateTheme(i, "bgColor", e.target.value)}
                                style={{ width: 58, padding: "2px 4px", fontSize: 11 }}
                              />
                            </label>
                            <span
                              style={{
                                padding: "2px 6px",
                                borderRadius: 4,
                                fontSize: 11,
                                background: t.bgColor,
                                color: t.color,
                                border: "1px solid #ddd",
                              }}
                            >
                              {t.name || t.slug}
                            </span>
                            <button type="button" onClick={() => removeTheme(i)} style={{ padding: "2px 8px", fontSize: 11, border: "1px solid #c00", background: "#fff", color: "#c00", cursor: "pointer", borderRadius: 4 }}>
                              削除
                            </button>
                          </div>
                        </div>
                      ))}
                      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                        <button type="button" onClick={addTheme} style={{ padding: "6px 12px", border: "1px solid #3d6b6b", borderRadius: 6, background: "#fff", color: "#3d6b6b", cursor: "pointer", fontSize: 12 }}>
                          ＋ 追加
                        </button>
                        <button type="button" onClick={saveThemes} disabled={savingThemes} style={{ padding: "6px 12px", border: "none", borderRadius: 6, background: "#3d6b6b", color: "#fff", cursor: savingThemes ? "wait" : "pointer", fontSize: 12 }}>
                          {savingThemes ? "保存中…" : "保存"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

                {selectedBlock && (
                  <>
                    <div style={{ marginBottom: 16, width: "100%", overflow: "visible" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", border: "1px solid #d0d0d0", tableLayout: "fixed" }}>
                        <colgroup>
                          <col style={{ width: "36px" }} />
                          <col style={{ width: "64px" }} />
                          <col style={{ width: "88px" }} />
                          <col style={{ width: "24%" }} />
                          <col style={{ width: "88px" }} />
                          <col style={{ width: "24%" }} />
                          <col style={{ width: "88px" }} />
                          <col style={{ width: "24%" }} />
                        </colgroup>
                        <thead>
                          <tr style={{ background: "#3d6b6b", color: "#fff" }}>
                            <th style={thStyle}></th>
                            <th style={thStyle}>回</th>
                            <th style={thStyle}>分類</th>
                            <th style={thStyle}>12</th>
                            <th style={thStyle}>分類</th>
                            <th style={thStyle}>24</th>
                            <th style={thStyle}>分類</th>
                            <th style={thStyle}>48</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedBlock.rows.map((row, i) => (
                            <tr key={i}>
                              <td style={tdCheckStyle}>
                                <input
                                  type="checkbox"
                                  checked={checkedRows.has(i)}
                                  onChange={() => toggleCheckRow(i)}
                                  style={{ width: 18, height: 18, cursor: "pointer" }}
                                />
                              </td>
                              <td style={tdKomaStyle}>
                                <input
                                  type="text"
                                  value={row.koma}
                                  onChange={(e) => updateRow(selectedBlock.id, i, "koma", e.target.value)}
                                  style={inputKomaStyle}
                                />
                              </td>
                              <td style={tdStyle}>
                                <select
                                  value={row.theme12 ?? ""}
                                  onChange={(e) => updateRow(selectedBlock.id, i, "theme12", e.target.value)}
                                  style={{ width: "100%", padding: "6px 8px", fontSize: 13 }}
                                >
                                  <option value="">—</option>
                                  {themes.map((t) => (
                                    <option key={t.slug} value={t.slug}>{t.name || t.slug}</option>
                                  ))}
                                </select>
                              </td>
                              <td style={tdStyle}>
                                <textarea value={row.c12} onChange={(e) => updateRow(selectedBlock.id, i, "c12", e.target.value)} rows={2} style={contentInputStyle} />
                              </td>
                              <td style={tdStyle}>
                                <select
                                  value={row.theme24 ?? ""}
                                  onChange={(e) => updateRow(selectedBlock.id, i, "theme24", e.target.value)}
                                  style={{ width: "100%", padding: "6px 8px", fontSize: 13 }}
                                >
                                  <option value="">—</option>
                                  {themes.map((t) => (
                                    <option key={t.slug} value={t.slug}>{t.name || t.slug}</option>
                                  ))}
                                </select>
                              </td>
                              <td style={tdStyle}>
                                <textarea value={row.c24} onChange={(e) => updateRow(selectedBlock.id, i, "c24", e.target.value)} rows={2} style={contentInputStyle} />
                              </td>
                              <td style={tdStyle}>
                                <select
                                  value={row.theme48 ?? ""}
                                  onChange={(e) => updateRow(selectedBlock.id, i, "theme48", e.target.value)}
                                  style={{ width: "100%", padding: "6px 8px", fontSize: 13 }}
                                >
                                  <option value="">—</option>
                                  {themes.map((t) => (
                                    <option key={t.slug} value={t.slug}>{t.name || t.slug}</option>
                                  ))}
                                </select>
                              </td>
                              <td style={tdStyle}>
                                <textarea value={row.c48} onChange={(e) => updateRow(selectedBlock.id, i, "c48", e.target.value)} rows={2} style={contentInputStyle} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 12, flexWrap: "wrap" }}>
                      <button
                        type="button"
                        onClick={addRow}
                        style={{
                          padding: "10px 20px",
                          background: "#fff",
                          color: "#3d6b6b",
                          border: "1px solid #3d6b6b",
                          borderRadius: 8,
                          cursor: "pointer",
                          fontWeight: 500,
                        }}
                      >
                        ＋ 行を追加
                      </button>
                      <button
                        type="button"
                        onClick={removeCheckedRows}
                        disabled={checkedRows.size === 0}
                        style={{
                          padding: "10px 20px",
                          background: checkedRows.size > 0 ? "#fff" : "#f5f5f5",
                          color: checkedRows.size > 0 ? "#c00" : "#999",
                          border: `1px solid ${checkedRows.size > 0 ? "#c00" : "#ddd"}`,
                          borderRadius: 8,
                          cursor: checkedRows.size > 0 ? "pointer" : "not-allowed",
                          fontWeight: 500,
                        }}
                      >
                        チェックした行を削除 {checkedRows.size > 0 ? `(${checkedRows.size})` : ""}
                      </button>
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
                    </div>
                  </>
                )}
            </div>
          ) : mainTab === "kojin" ? (
            <p style={{ color: "#666", padding: 24 }}>個人レッスンのカリキュラムは「短期集中個人」タブで編集できます。</p>
          ) : (
            <p style={{ color: "#666", padding: 24 }}>準備中です。</p>
          )}
        </>
      ) : (
        <>
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
                <table style={{ width: "100%", minWidth: showThemeColumns ? 1600 : 960, borderCollapse: "collapse", background: "#fff", border: "1px solid #d0d0d0", tableLayout: "fixed" }}>
                  <colgroup>
                    <col style={{ width: "36px" }} />
                    <col style={{ width: "64px" }} />
                    {showThemeColumns && <col style={{ width: "100px" }} />}
                    <col />
                    {showThemeColumns && <col style={{ width: "100px" }} />}
                    <col />
                    {showThemeColumns && <col style={{ width: "100px" }} />}
                    <col />
                  </colgroup>
                  <thead>
                    <tr style={{ background: "#3d6b6b", color: "#fff" }}>
                      <th style={thStyle}></th>
                      <th style={thStyle}>回</th>
                      {showThemeColumns && <th style={thStyle}>分類</th>}
                      <th style={thStyle}>12</th>
                      {showThemeColumns && <th style={thStyle}>分類</th>}
                      <th style={thStyle}>24</th>
                      {showThemeColumns && <th style={thStyle}>分類</th>}
                      <th style={thStyle}>48</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedBlock.rows.map((row, i) => (
                      <tr key={i}>
                        <td style={tdCheckStyle}>
                          <input
                            type="checkbox"
                            checked={checkedRows.has(i)}
                            onChange={() => toggleCheckRow(i)}
                            style={{ width: 18, height: 18, cursor: "pointer" }}
                          />
                        </td>
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
                          <textarea
                            value={row.c12}
                            onChange={(e) => updateRow(selectedBlock.id, i, "c12", e.target.value)}
                            rows={2}
                            style={contentInputStyle}
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
                          <textarea
                            value={row.c24}
                            onChange={(e) => updateRow(selectedBlock.id, i, "c24", e.target.value)}
                            rows={2}
                            style={contentInputStyle}
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
                          <textarea
                            value={row.c48}
                            onChange={(e) => updateRow(selectedBlock.id, i, "c48", e.target.value)}
                            rows={2}
                            style={contentInputStyle}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 12, flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={addRow}
                  style={{
                    padding: "10px 20px",
                    background: "#fff",
                    color: "#3d6b6b",
                    border: "1px solid #3d6b6b",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  ＋ 行を追加
                </button>
                <button
                  type="button"
                  onClick={removeCheckedRows}
                  disabled={checkedRows.size === 0}
                  style={{
                    padding: "10px 20px",
                    background: checkedRows.size > 0 ? "#fff" : "#f5f5f5",
                    color: checkedRows.size > 0 ? "#c00" : "#999",
                    border: `1px solid ${checkedRows.size > 0 ? "#c00" : "#ddd"}`,
                    borderRadius: 8,
                    cursor: checkedRows.size > 0 ? "pointer" : "not-allowed",
                    fontWeight: 500,
                  }}
                >
                  チェックした行を削除 {checkedRows.size > 0 ? `(${checkedRows.size})` : ""}
                </button>
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
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = { padding: "10px 12px", textAlign: "left", border: "1px solid #d0d0d0" };
const tdStyle: React.CSSProperties = { padding: 8, border: "1px solid #d0d0d0", verticalAlign: "top" };
const tdCheckStyle: React.CSSProperties = { padding: 8, border: "1px solid #d0d0d0", verticalAlign: "top", textAlign: "center" };
const tdKomaStyle: React.CSSProperties = { padding: 6, border: "1px solid #d0d0d0", verticalAlign: "top" };
const inputStyle: React.CSSProperties = { width: "100%", minHeight: 36, padding: "8px 10px", border: "1px solid #ddd", borderRadius: 4, boxSizing: "border-box", fontSize: 14 };
const inputKomaStyle: React.CSSProperties = { width: "100%", minHeight: 36, padding: "8px 6px", border: "1px solid #ddd", borderRadius: 4, boxSizing: "border-box", fontSize: 14 };
/** カリキュラム内容入力（複数行・大きく表示） */
const contentInputStyle: React.CSSProperties = { width: "100%", minHeight: 56, padding: "10px 12px", border: "1px solid #ddd", borderRadius: 4, boxSizing: "border-box", fontSize: 14, lineHeight: 1.5, resize: "vertical" };

export default function EditPage() {
  return (
    <Suspense fallback={<p>読み込み中…</p>}>
      <EditContent />
    </Suspense>
  );
}
