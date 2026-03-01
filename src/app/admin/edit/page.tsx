"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import type { CurriculumBlock, CurriculumRow } from "@/app/api/curriculum/route";

const PAGE_LABELS: Record<string, string> = {
  kojin: "個人レッスン",
  group: "グループ",
  kaiwa: "会話",
  special: "試験対策",
  syutyu: "集中講座",
  trial: "通信講座",
  book: "著書",
};

function EditContent() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "kojin";
  const [blocks, setBlocks] = useState<CurriculumBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<CurriculumBlock | null>(null);
  const [dirty, setDirty] = useState(false);
  const [seeding, setSeeding] = useState(false);

  // 初級→中級→上級の順
  const KOJIN_BLOCK_ORDER = ["curriculum_shokyu", "curriculum_chukyu", "curriculum_jokyu"];

  useEffect(() => {
    fetch(`/api/curriculum?page=${page}`)
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        const sorted =
          page === "kojin"
            ? [...list].sort(
                (a, b) =>
                  KOJIN_BLOCK_ORDER.indexOf(a.blockKey) - KOJIN_BLOCK_ORDER.indexOf(b.blockKey)
              )
            : list;
        setBlocks(sorted);
        if (sorted[0]) setSelectedBlock(sorted[0]);
      })
      .finally(() => setLoading(false));
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
              <div style={{ overflowX: "auto", marginBottom: 16 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", border: "1px solid #d0d0d0" }}>
                  <thead>
                    <tr style={{ background: "#3d6b6b", color: "#fff" }}>
                      <th style={thStyle}>コマ</th>
                      <th style={thStyle}>12コマ</th>
                      <th style={thStyle}>24コマ</th>
                      <th style={thStyle}>48コマ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedBlock.rows.map((row, i) => (
                      <tr key={i}>
                        <td style={tdStyle}>
                          <input
                            type="text"
                            value={row.koma}
                            onChange={(e) => updateRow(selectedBlock.id, i, "koma", e.target.value)}
                            style={inputStyle}
                          />
                        </td>
                        <td style={tdStyle}>
                          <input
                            type="text"
                            value={row.c12}
                            onChange={(e) => updateRow(selectedBlock.id, i, "c12", e.target.value)}
                            style={inputStyle}
                          />
                        </td>
                        <td style={tdStyle}>
                          <input
                            type="text"
                            value={row.c24}
                            onChange={(e) => updateRow(selectedBlock.id, i, "c24", e.target.value)}
                            style={inputStyle}
                          />
                        </td>
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
const tdStyle: React.CSSProperties = { padding: 4, border: "1px solid #d0d0d0" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "6px 8px", border: "1px solid #ddd", borderRadius: 4, boxSizing: "border-box" };

export default function EditPage() {
  return (
    <Suspense fallback={<p>読み込み中…</p>}>
      <EditContent />
    </Suspense>
  );
}
