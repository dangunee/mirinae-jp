"use client";

import { useEffect, useState } from "react";

const YOUTUBE_CATEGORIES = [
  "生活韓国語",
  "TOPIK初級",
  "TOPIK中級",
  "TOPIK上級",
  "役に立つ韓国語",
] as const;

type YouTubeVideo = {
  id: string;
  videoId: string;
  title: string;
  category: string | null;
  description: string | null;
  seoSummary: string | null;
  duration: string | null;
  uploadDate: string | null;
  sortOrder: number;
};

const extractVideoId = (v: string) =>
  (v || "").replace(/^.*(?:youtube\.com\/watch\?v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11}).*$/, "$1") || v.trim();

export default function YouTubeAdminPage() {
  const [list, setList] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<YouTubeVideo | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ videoId: "", title: "", category: "", categoryCustom: "", description: "", seoSummary: "", duration: "", uploadDate: "", sortOrder: 0 });

  const load = () => {
    setLoading(true);
    fetch("/api/admin/youtube")
      .then((r) => r.json())
      .then((data) => setList(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), []);

  const startAdd = () => {
    setEditing(null);
    setAdding(true);
    setForm({ videoId: "", title: "", category: "", categoryCustom: "", description: "", seoSummary: "", duration: "", uploadDate: "", sortOrder: list.length });
  };

  const startEdit = (v: YouTubeVideo) => {
    setEditing(v);
    setAdding(false);
    const cat = v.category || "";
    const isPreset = YOUTUBE_CATEGORIES.includes(cat as (typeof YOUTUBE_CATEGORIES)[number]);
    setForm({
      videoId: v.videoId,
      title: v.title,
      category: isPreset ? cat : "_custom",
      categoryCustom: isPreset ? "" : cat,
      description: v.description || "",
      seoSummary: v.seoSummary || "",
      duration: v.duration || "",
      uploadDate: v.uploadDate || "",
      sortOrder: v.sortOrder,
    });
  };

  const cancelEdit = () => {
    setEditing(null);
    setAdding(false);
    setForm({ videoId: "", title: "", category: "", categoryCustom: "", description: "", seoSummary: "", duration: "", uploadDate: "", sortOrder: 0 });
  };

  const getCategoryValue = () =>
    form.category === "_custom" ? form.categoryCustom.trim() : form.category;

  const save = async () => {
    if (!form.title.trim()) return alert("タイトルを入力してください");
    const vid = extractVideoId(form.videoId);
    if (!vid) return alert("YouTube動画IDまたはURLを入力してください");
    setSaving(true);
    try {
      if (editing) {
        await fetch("/api/admin/youtube", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editing.id,
            videoId: vid,
            title: form.title.trim(),
            category: getCategoryValue() || null,
            description: form.description.trim() || null,
            seoSummary: form.seoSummary.trim() || null,
            duration: form.duration.trim() || null,
            uploadDate: form.uploadDate.trim() || null,
            sortOrder: form.sortOrder,
          }),
        });
      } else {
        await fetch("/api/admin/youtube", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            videoId: vid,
            title: form.title.trim(),
            category: getCategoryValue() || null,
            description: form.description.trim() || null,
            seoSummary: form.seoSummary.trim() || null,
            duration: form.duration.trim() || null,
            uploadDate: form.uploadDate.trim() || null,
            sortOrder: form.sortOrder,
          }),
        });
      }
      cancelEdit();
      load();
    } catch (e) {
      alert("保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("削除しますか？")) return;
    setSaving(true);
    try {
      await fetch(`/api/admin/youtube?id=${id}`, { method: "DELETE" });
      cancelEdit();
      load();
    } finally {
      setSaving(false);
    }
  };

  const style = {
    input: { width: "100%", padding: "8px 12px", fontSize: 14, border: "1px solid #ddd", borderRadius: 6 } as React.CSSProperties,
    textarea: { width: "100%", padding: "8px 12px", fontSize: 14, border: "1px solid #ddd", borderRadius: 6, minHeight: 80 } as React.CSSProperties,
    btn: { padding: "8px 16px", borderRadius: 6, cursor: "pointer", fontWeight: 500 } as React.CSSProperties,
  };

  return (
    <div>
      <p style={{ marginBottom: 16 }}>
        <a href="/admin" style={{ color: "#4a6fa5" }}>← 一覧</a>
      </p>
      <h1 style={{ fontSize: 24, marginBottom: 24 }}>ためになるミリネYouTube</h1>
      <p style={{ marginBottom: 24, color: "#666", fontSize: 14 }}>
        メインページの動画一覧です。SEO用に「要約説明」「再生時間」を入力すると検索エンジンに有利です。
      </p>
      <button
        type="button"
        onClick={async () => {
          setSaving(true);
          try {
            const r = await fetch("/api/seed/youtube", { method: "POST" });
            const j = await r.json();
            if (r.ok) alert("初期データを登録しました（" + j.count + "件）");
            else alert(j.error || "失敗");
            load();
          } finally {
            setSaving(false);
          }
        }}
        disabled={saving || loading}
        style={{ marginBottom: 16, ...style.btn, background: "#fff", color: "#3d6b6b", border: "1px solid #3d6b6b" }}
      >
        初期データを登録
      </button>

      {loading ? (
        <p>読み込み中…</p>
      ) : (
        <>
          <div style={{ marginBottom: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={startAdd}
              style={{ ...style.btn, background: "#3d6b6b", color: "#fff", border: "none" }}
            >
              ＋ 動画を追加
            </button>
          </div>

          {(editing || adding) && (
            <div style={{ background: "#f8f8f8", padding: 24, borderRadius: 12, marginBottom: 24, border: "1px solid #e5e5e5" }}>
              <h3 style={{ marginBottom: 16, fontSize: 16 }}>{editing ? "編集" : "新規追加"}</h3>
              <div style={{ display: "grid", gap: 16, maxWidth: 600 }}>
                <div>
                  <label style={{ display: "block", marginBottom: 4, fontSize: 13, fontWeight: 500 }}>YouTube動画ID / URL</label>
                  <input
                    type="text"
                    value={form.videoId}
                    onChange={(e) => setForm({ ...form, videoId: e.target.value })}
                    placeholder="例: FEtiZL1n5ls または https://.../watch?v=FEtiZL1n5ls"
                    style={style.input}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: 4, fontSize: 13, fontWeight: 500 }}>タイトル</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="例: 役に立つ韓国語動画①"
                    style={style.input}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: 4, fontSize: 13, fontWeight: 500 }}>分類</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    style={style.input}
                  >
                    <option value="">— 選択 —</option>
                    {YOUTUBE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                    <option value="_custom">その他（直接入力）</option>
                  </select>
                  {form.category === "_custom" && (
                    <input
                      type="text"
                      value={form.categoryCustom}
                      onChange={(e) => setForm({ ...form, categoryCustom: e.target.value })}
                      placeholder="分類名を入力"
                      style={{ ...style.input, marginTop: 8 }}
                    />
                  )}
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: 4, fontSize: 13, fontWeight: 500 }}>説明（カード表示用）</label>
                  <input
                    type="text"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="短い説明（任意）"
                    style={style.input}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: 4, fontSize: 13, fontWeight: 500 }}>SEO用要約（2〜3文）</label>
                  <textarea
                    value={form.seoSummary}
                    onChange={(e) => setForm({ ...form, seoSummary: e.target.value })}
                    placeholder="検索エンジン向け。各動画の内容を2〜3文で説明してください。"
                    style={style.textarea}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: 4, fontSize: 13, fontWeight: 500 }}>再生時間（ISO 8601）</label>
                  <input
                    type="text"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    placeholder="例: PT5M30S（5分30秒）"
                    style={style.input}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: 4, fontSize: 13, fontWeight: 500 }}>アップロード日（Schema.org用）</label>
                  <input
                    type="text"
                    value={form.uploadDate}
                    onChange={(e) => setForm({ ...form, uploadDate: e.target.value })}
                    placeholder="例: 2024-01-15T12:00:00+09:00（空欄なら登録日を使用）"
                    style={style.input}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: 4, fontSize: 13, fontWeight: 500 }}>表示順</label>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value, 10) || 0 })}
                    style={{ ...style.input, width: 100 }}
                  />
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    type="button"
                    onClick={save}
                    disabled={saving}
                    style={{ ...style.btn, background: "#3d6b6b", color: "#fff", border: "none" }}
                  >
                    {saving ? "保存中…" : "保存"}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    style={{ ...style.btn, background: "#fff", color: "#3d6b6b", border: "1px solid #3d6b6b" }}
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            </div>
          )}

          <ul style={{ listStyle: "none", padding: 0 }}>
            {list.map((v) => (
              <li
                key={v.id}
                style={{
                  padding: 16,
                  marginBottom: 12,
                  background: "#fff",
                  border: "1px solid #e5e5e5",
                  borderRadius: 8,
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                }}
              >
                <img
                  src={`https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`}
                  alt=""
                  style={{ width: 120, height: 68, objectFit: "cover", borderRadius: 6, flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                    {v.category && (
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 8px",
                          fontSize: 11,
                          fontWeight: 600,
                          color: "#3d6b6b",
                          background: "#e8f0f0",
                          borderRadius: 4,
                        }}
                      >
                        {v.category}
                      </span>
                    )}
                    <h4 style={{ fontSize: 15, margin: 0 }}>{v.title}</h4>
                  </div>
                  <p style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>ID: {v.videoId}</p>
                  {v.seoSummary && <p style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}>{v.seoSummary}</p>}
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={() => startEdit(v)}
                    style={{ ...style.btn, background: "#fff", color: "#3d6b6b", border: "1px solid #3d6b6b", padding: "6px 12px", fontSize: 13 }}
                  >
                    編集
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(v.id)}
                    disabled={saving}
                    style={{ ...style.btn, background: "#fff", color: "#c00", border: "1px solid #c00", padding: "6px 12px", fontSize: 13 }}
                  >
                    削除
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {list.length === 0 && !loading && (
            <p style={{ color: "#666", padding: 24 }}>動画がありません。「＋ 動画を追加」から登録してください。</p>
          )}
        </>
      )}
    </div>
  );
}
