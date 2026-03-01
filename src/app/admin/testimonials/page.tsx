"use client";

import { useEffect, useState } from "react";
import type { TestimonialsBlock, TestimonialRow } from "@/app/api/testimonials/route";

const PAGES = [
  { slug: "kojin", label: "個人レッスン" },
  { slug: "group", label: "グループレッスン" },
  { slug: "kaiwa", label: "会話強化クラス" },
  { slug: "special", label: "試験対策講座" },
  { slug: "syutyu", label: "集中講座" },
  { slug: "trial", label: "お申込み・通信" },
];

const BLOCK_OPTIONS: Record<string, { key: string; title: string }[]> = {
  kojin: [
    { key: "testimonials_kojin_tab01", title: "個人レッスン" },
    { key: "testimonials_kojin_tab02", title: "短期集中個人" },
    { key: "testimonials_kojin_tab03", title: "発音矯正" },
    { key: "testimonials_kojin_tab04", title: "レベルテスト" },
  ],
  group: [
    { key: "testimonials_group_tab01", title: "入門＆初級" },
    { key: "testimonials_group_tab02", title: "中級文法" },
    { key: "testimonials_group_tab03", title: "上級文法" },
    { key: "testimonials_group_tab04", title: "中級月1" },
    { key: "testimonials_group_tab05", title: "上級1土曜" },
    { key: "testimonials_group_tab06", title: "上級2土曜" },
  ],
  kaiwa: [
    { key: "testimonials_kaiwa_tab01", title: "会話クラス" },
    { key: "testimonials_kaiwa_tab02", title: "音読クラス" },
    { key: "testimonials_kaiwa_tab03", title: "その他" },
  ],
  special: [
    { key: "testimonials_special_tab01", title: "TOPIK初級" },
    { key: "testimonials_special_tab02", title: "TOPIK中級" },
    { key: "testimonials_special_tab03", title: "TOPIK上級" },
    { key: "testimonials_special_main", title: "試験対策（共通）" },
  ],
  syutyu: [
    { key: "testimonials_syutyu_tab01", title: "入門" },
    { key: "testimonials_syutyu_tab02", title: "初級" },
    { key: "testimonials_syutyu_tab03", title: "中級" },
    { key: "testimonials_syutyu_tab04", title: "上級" },
  ],
  trial: [{ key: "testimonials_trial", title: "お申込み・体験" }],
};

export default function TestimonialsPage() {
  const [page, setPage] = useState("kojin");
  const [blocks, setBlocks] = useState<TestimonialsBlock[]>([]);
  const [selected, setSelected] = useState<TestimonialsBlock | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    setLoading(true);
    setSelected(null);
    fetch(`/api/testimonials?page=${page}`)
      .then((r) => r.json())
      .then((data) => {
        setBlocks(Array.isArray(data) ? data : []);
      })
      .finally(() => setLoading(false));
  }, [page]);

  const updateRow = (index: number, field: "header" | "content", value: string) => {
    if (!selected) return;
    const rows = [...selected.rows];
    if (!rows[index]) return;
    rows[index] = { ...rows[index], [field]: value };
    setSelected({ ...selected, rows });
    setDirty(true);
  };

  const addRow = () => {
    if (!selected) return;
    setSelected({ ...selected, rows: [...selected.rows, { header: "", content: "" }] });
    setDirty(true);
  };

  const removeRow = (index: number) => {
    if (!selected) return;
    setSelected({ ...selected, rows: selected.rows.filter((_, i) => i !== index) });
    setDirty(true);
  };

  const save = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selected.id,
          pageSlug: selected.pageSlug,
          blockKey: selected.blockKey,
          title: selected.title,
          rows: selected.rows,
        }),
      });
      setDirty(false);
      const res = await fetch(`/api/testimonials?page=${page}`);
      const data = await res.json();
      setBlocks(Array.isArray(data) ? data : []);
      const found = (Array.isArray(data) ? data : []).find((b: TestimonialsBlock) => b.id === selected.id);
      if (found) setSelected(found);
    } finally {
      setSaving(false);
    }
  };

  const createBlock = async (blockKey: string, title: string) => {
    setSaving(true);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageSlug: page,
          blockKey,
          title,
          rows: [],
        }),
      });
      const created = await res.json();
      const list = await fetch(`/api/testimonials?page=${page}`).then((r) => r.json());
      setBlocks(Array.isArray(list) ? list : []);
      setSelected({ ...created, rows: [] });
    } finally {
      setSaving(false);
    }
  };

  const opts = BLOCK_OPTIONS[page] || [];
  const existingKeys = new Set(blocks.map((b) => b.blockKey));
  const canCreate = opts.filter((o) => !existingKeys.has(o.key));

  return (
    <div>
      <p style={{ marginBottom: 16 }}>
        <a href="/admin" style={{ color: "#4a6fa5" }}>← 一覧</a>
        <span style={{ marginLeft: 16 }}>生徒の声（ページ別）</span>
        <button
          type="button"
          onClick={async () => {
            setSeeding(true);
            try {
              const r = await fetch("/api/seed/testimonials", { method: "POST" });
              const j = await r.json();
              if (r.ok) {
                const res = await fetch(`/api/testimonials?page=${page}`);
                const data = await res.json();
                setBlocks(Array.isArray(data) ? data : []);
              } else alert(j.error || "失敗");
            } finally {
              setSeeding(false);
            }
          }}
          disabled={seeding}
          style={{ marginLeft: 16, padding: "6px 12px", fontSize: 13, border: "1px solid #3d6b6b", background: "#fff", color: "#3d6b6b", borderRadius: 6, cursor: "pointer" }}
        >
          {seeding ? "登録中…" : "短期集中サンプルを登録"}
        </button>
      </p>

      <div style={{ marginBottom: 20 }}>
        <label style={{ marginRight: 8 }}>ページ:</label>
        <select
          value={page}
          onChange={(e) => setPage(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #ddd" }}
        >
          {PAGES.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>読み込み中…</p>
      ) : (
        <>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            {blocks.map((b) => (
              <button
                key={b.id}
                onClick={() => { setSelected(b); setDirty(false); }}
                style={{
                  padding: "8px 14px",
                  border: selected?.id === b.id ? "2px solid #3d6b6b" : "1px solid #ddd",
                  borderRadius: 6,
                  background: selected?.id === b.id ? "#e8f0f0" : "#fff",
                  cursor: "pointer",
                }}
              >
                {b.title || b.blockKey}
              </button>
            ))}
            {canCreate.length > 0 && (
              <span style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                {canCreate.map((o) => (
                  <button
                    key={o.key}
                    onClick={() => createBlock(o.key, o.title)}
                    disabled={saving}
                    style={{
                      padding: "6px 12px",
                      border: "1px solid #3d6b6b",
                      borderRadius: 6,
                      background: "#fff",
                      color: "#3d6b6b",
                      cursor: "pointer",
                      fontSize: 13,
                    }}
                  >
                    ＋ {o.title}
                  </button>
                ))}
              </span>
            )}
          </div>

          {selected && (
            <>
              <p style={{ marginBottom: 8, color: "#666" }}>見出し（例: A様｜48コマ｜2020.1）と本文を編集</p>
              <div style={{ marginBottom: 12 }}>
                {selected.rows.map((row, i) => (
                  <div
                    key={i}
                    style={{
                      border: "1px solid #e5e5e5",
                      borderRadius: 8,
                      padding: 12,
                      marginBottom: 12,
                      background: "#fafafa",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <strong>#{i + 1}</strong>
                      <button
                        type="button"
                        onClick={() => removeRow(i)}
                        style={{ padding: "4px 10px", border: "1px solid #c00", color: "#c00", background: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12 }}
                      >
                        削除
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="見出し"
                      value={row.header}
                      onChange={(e) => updateRow(i, "header", e.target.value)}
                      style={{ width: "100%", padding: "8px 10px", marginBottom: 8, border: "1px solid #ddd", borderRadius: 4, boxSizing: "border-box" }}
                    />
                    <textarea
                      placeholder="本文（HTML可）"
                      value={row.content}
                      onChange={(e) => updateRow(i, "content", e.target.value)}
                      rows={4}
                      style={{ width: "100%", padding: "8px 10px", border: "1px solid #ddd", borderRadius: 4, boxSizing: "border-box", fontFamily: "inherit" }}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addRow}
                  style={{ padding: "8px 16px", border: "1px dashed #3d6b6b", color: "#3d6b6b", background: "#fff", borderRadius: 6, cursor: "pointer" }}
                >
                  ＋ 声を追加
                </button>
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
