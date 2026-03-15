"use client";

import { useEffect, useState } from "react";

const DOW_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

const MONTHLY_WEEKS_OPTIONS = [
  { value: "", label: "毎週" },
  { value: "1,3", label: "毎月1・3週" },
  { value: "2,4", label: "毎月2・4週" },
] as const;

type ScheduleCategory = { id: string; value: string; label: string; color: string; sortOrder: number };

type ScheduleEvent = {
  id: string;
  eventType: string;
  label: string;
  cat: string;
  time: string | null;
  detail: string | null;
  url: string | null;
  dow: number | null;
  biweekly: boolean;
  biweeklyStartDate: string | null;
  monthlyWeeks: string | null;
  endDate: string | null;
  date: string | null;
  sortOrder: number;
};

const defaultForm: {
  eventType: "recurring" | "single";
  label: string;
  cat: string;
  time: string;
  detail: string;
  url: string;
  dow: number;
  biweekly: boolean;
  biweeklyStartDate: string;
  monthlyWeeks: string;
  endDate: string;
  date: string;
  sortOrder: number;
} = {
  eventType: "recurring",
  label: "",
  cat: "",
  time: "",
  detail: "",
  url: "",
  dow: 3,
  biweekly: false,
  biweeklyStartDate: "",
  monthlyWeeks: "",
  endDate: "",
  date: "",
  sortOrder: 0,
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function dateKey(y: number, m: number, d: number) {
  return `${y}-${pad(m + 1)}-${pad(d)}`;
}

function isBiweekly(y: number, m: number, d: number, startStr: string | null) {
  if (!startStr) return true;
  const dt = new Date(y, m, d);
  const start = new Date(startStr);
  const diff = Math.round((dt.getTime() - start.getTime()) / 86400000);
  return diff >= 0 && diff % 14 === 0;
}

function getOccurrenceInMonth(y: number, m: number, d: number, dow: number) {
  let occ = 0;
  for (let i = 1; i <= d; i++) {
    if (new Date(y, m, i).getDay() === dow) occ++;
  }
  return occ;
}

function matchesMonthlyWeeks(y: number, m: number, d: number, dow: number, weeklyStr: string | null) {
  if (!weeklyStr) return true;
  const occ = getOccurrenceInMonth(y, m, d, dow);
  const parts = weeklyStr.split(",").map((p) => parseInt(p.trim(), 10));
  return parts.includes(occ);
}

export default function ScheduleAdminPage() {
  const [list, setList] = useState<ScheduleEvent[]>([]);
  const [categories, setCategories] = useState<ScheduleCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<ScheduleEvent | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [catEditing, setCatEditing] = useState<ScheduleCategory | null>(null);
  const [catAdding, setCatAdding] = useState(false);
  const [catForm, setCatForm] = useState({ value: "", label: "", color: "#e5e7eb" });
  const [showInlineCatAdd, setShowInlineCatAdd] = useState(false);
  const [inlineCatForm, setInlineCatForm] = useState({ value: "", label: "", color: "#e5e7eb" });

  const load = () => {
    setLoading(true);
    Promise.all([
      fetch("/api/admin/schedule").then((r) => r.json()),
      fetch("/api/admin/schedule/categories").then((r) => r.json()),
    ])
      .then(([scheduleData, catData]) => {
        setList(Array.isArray(scheduleData) ? scheduleData : []);
        setCategories(Array.isArray(catData) ? catData : []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), []);

  useEffect(() => {
    if (!editing && !adding) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cancelEdit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editing, adding]);

  const startAdd = () => {
    setEditing(null);
    setAdding(true);
    setForm({
      ...defaultForm,
      cat: categories[0]?.value || "",
      sortOrder: list.length,
    });
  };

  const startAddForDate = (y: number, m: number, d: number) => {
    const dateStr = dateKey(y, m, d);
    setEditing(null);
    setAdding(true);
    setForm({
      ...defaultForm,
      cat: categories[0]?.value || "",
      eventType: "single",
      date: dateStr,
      sortOrder: list.length,
    });
  };

  const getEventsForDate = (y: number, m: number, d: number) => {
    const dow = new Date(y, m, d).getDay();
    const key = dateKey(y, m, d);
    const evts: ScheduleEvent[] = [];
    for (const e of list) {
      if (e.eventType === "recurring" && e.dow === dow) {
        if (e.biweekly && !isBiweekly(y, m, d, e.biweeklyStartDate)) continue;
        if (e.endDate && key > e.endDate) continue;
        if (e.monthlyWeeks && !matchesMonthlyWeeks(y, m, d, dow, e.monthlyWeeks)) continue;
        evts.push(e);
      } else if (e.eventType === "single" && e.date === key) {
        evts.push(e);
      }
    }
    return evts;
  };

  const startEdit = (e: ScheduleEvent) => {
    setEditing(e);
    setAdding(false);
    setForm({
      eventType: e.eventType === "single" ? "single" : "recurring",
      label: e.label,
      cat: e.cat,
      time: e.time || "",
      detail: e.detail || "",
      url: e.url || "",
      dow: e.dow ?? 3,
      biweekly: e.biweekly,
      biweeklyStartDate: e.biweeklyStartDate?.slice(0, 10) || "",
      monthlyWeeks: e.monthlyWeeks || "",
      endDate: e.endDate || "",
      date: e.date || "",
      sortOrder: e.sortOrder,
    });
  };

  const cancelEdit = () => {
    setEditing(null);
    setAdding(false);
    setForm(defaultForm);
    setShowInlineCatAdd(false);
  };

  const save = async () => {
    if (!form.label.trim()) return alert("講座名を入力してください");
    if (!form.cat) return alert("カテゴリを選択してください");
    if (form.eventType === "recurring" && form.dow === undefined) return alert("曜日を選択してください");
    if (form.eventType === "single" && !form.date.trim()) return alert("日付を入力してください（YYYY-MM-DD）");
    setSaving(true);
    try {
      const payload = {
        ...form,
        biweeklyStartDate: form.biweekly ? form.biweeklyStartDate || null : null,
        monthlyWeeks: form.eventType === "recurring" && form.monthlyWeeks ? form.monthlyWeeks : null,
        endDate: form.eventType === "recurring" && form.endDate ? form.endDate : null,
      };
      const r = editing
        ? await fetch("/api/admin/schedule", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: editing.id, ...payload }),
          })
        : await fetch("/api/admin/schedule", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        throw new Error(data.error || data.message || `エラー (${r.status})`);
      }
      cancelEdit();
      load();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "保存に失敗しました";
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  const getCatColor = (catValue: string) => {
    const c = categories.find((x) => x.value === catValue);
    return c?.color || "#e5e7eb";
  };

  const getCatLabel = (catValue: string) => {
    const c = categories.find((x) => x.value === catValue);
    return c?.label || catValue;
  };

  const saveCategory = async () => {
    if (!catForm.value.trim() || !catForm.label.trim()) return alert("カテゴリIDと表示名を入力してください");
    setSaving(true);
    try {
      if (catEditing) {
        await fetch("/api/admin/schedule/categories", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: catEditing.id, ...catForm }),
        });
      } else {
        await fetch("/api/admin/schedule/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(catForm),
        });
      }
      setCatEditing(null);
      setCatAdding(false);
      setCatForm({ value: "", label: "", color: "#e5e7eb" });
      load();
    } catch {
      alert("カテゴリの保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  const addCategoryFromDialog = async () => {
    if (!inlineCatForm.value.trim() || !inlineCatForm.label.trim()) return alert("カテゴリIDと表示名を入力してください");
    setSaving(true);
    try {
      const r = await fetch("/api/admin/schedule/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inlineCatForm),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        const msg = data.error || data.message || `エラー (${r.status})`;
        throw new Error(msg);
      }
      await load();
      setForm((prev) => ({ ...prev, cat: data.value }));
      setShowInlineCatAdd(false);
      setInlineCatForm({ value: "", label: "", color: "#e5e7eb" });
      alert("カテゴリを追加しました。イベントを保存するには「保存」ボタンを押してください。");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "カテゴリの追加に失敗しました";
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  const removeCategory = async (id: string) => {
    if (!confirm("このカテゴリを削除しますか？このカテゴリを使っているイベントは影響を受けます。")) return;
    setSaving(true);
    try {
      await fetch(`/api/admin/schedule/categories?id=${id}`, { method: "DELETE" });
      setCatEditing(null);
      load();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("削除しますか？")) return;
    setSaving(true);
    try {
      await fetch(`/api/admin/schedule?id=${id}`, { method: "DELETE" });
      cancelEdit();
      load();
    } finally {
      setSaving(false);
    }
  };

  const style = {
    input: { width: "100%", maxWidth: "100%", padding: "8px 12px", fontSize: 14, border: "1px solid #ddd", borderRadius: 6, boxSizing: "border-box" as const } as React.CSSProperties,
    textarea: { width: "100%", maxWidth: "100%", padding: "8px 12px", fontSize: 14, border: "1px solid #ddd", borderRadius: 6, minHeight: 60, boxSizing: "border-box" as const } as React.CSSProperties,
    btn: { padding: "8px 16px", borderRadius: 6, cursor: "pointer", fontWeight: 500 } as React.CSSProperties,
  };

  return (
    <div>
      <p style={{ marginBottom: 16 }}>
        <a href="/admin" style={{ color: "#4a6fa5" }}>← 一覧</a>
      </p>
      <h1 style={{ fontSize: 24, marginBottom: 24 }}>講座スケジュール</h1>
      <p style={{ marginBottom: 24, color: "#666", fontSize: 14 }}>
        メインページのカレンダーに表示する講座イベントを管理します。日付をクリックして単発イベントを追加できます。
      </p>

      {/* 月別カレンダー */}
      {!loading && (
        <div style={{ marginBottom: 32, background: "#fff", border: "1px solid #e5e5e5", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "#f8f8f8", borderBottom: "1px solid #e5e5e5" }}>
            <button
              type="button"
              onClick={() => {
                if (calMonth === 0) {
                  setCalMonth(11);
                  setCalYear(calYear - 1);
                } else setCalMonth(calMonth - 1);
              }}
              style={{ padding: "6px 12px", border: "1px solid #ddd", borderRadius: 6, background: "#fff", cursor: "pointer", fontSize: 14 }}
            >
              ←
            </button>
            <span style={{ fontWeight: 600, fontSize: 16 }}>{calYear}年{calMonth + 1}月</span>
            <button
              type="button"
              onClick={() => {
                if (calMonth === 11) {
                  setCalMonth(0);
                  setCalYear(calYear + 1);
                } else setCalMonth(calMonth + 1);
              }}
              style={{ padding: "6px 12px", border: "1px solid #ddd", borderRadius: 6, background: "#fff", cursor: "pointer", fontSize: 14 }}
            >
              →
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: 12 }}>
            {["日", "月", "火", "水", "木", "金", "土"].map((d) => (
              <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 600, color: "#666", padding: "8px 0" }}>{d}</div>
            ))}
            {(() => {
              const firstDow = new Date(calYear, calMonth, 1).getDay();
              const daysInM = new Date(calYear, calMonth + 1, 0).getDate();
              const daysInP = new Date(calYear, calMonth, 0).getDate();
              const cells: { day: number; y: number; m: number; isCur: boolean }[] = [];
              for (let i = firstDow - 1; i >= 0; i--) {
                const d = daysInP - i;
                const pm = calMonth - 1;
                const py = pm < 0 ? calYear - 1 : calYear;
                cells.push({ day: d, y: py, m: pm < 0 ? 11 : pm, isCur: false });
              }
              for (let d = 1; d <= daysInM; d++) cells.push({ day: d, y: calYear, m: calMonth, isCur: true });
              const remain = 42 - cells.length;
              for (let i = 1; i <= remain; i++) {
                const nm = calMonth + 1;
                const ny = nm > 11 ? calYear + 1 : calYear;
                cells.push({ day: i, y: ny, m: nm > 11 ? 0 : nm, isCur: false });
              }
              return cells.map((c, i) => {
                const evts = getEventsForDate(c.y, c.m, c.day);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => startAddForDate(c.y, c.m, c.day)}
                    style={{
                      minHeight: 56,
                      padding: "6px 4px",
                      border: "1px solid #eee",
                      borderRadius: 8,
                      background: c.isCur ? "#fff" : "#fafafa",
                      cursor: "pointer",
                      textAlign: "left",
                      fontSize: 12,
                      color: c.isCur ? "#333" : "#999",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{c.day}</span>
                    {evts.slice(0, 2).map((e) => (
                      <span
                        key={e.id}
                        style={{
                          fontSize: 9,
                          padding: "1px 4px",
                          borderRadius: 4,
                          background: getCatColor(e.cat) + "44",
                          color: getCatColor(e.cat),
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          maxWidth: "100%",
                          textOverflow: "ellipsis",
                        }}
                        title={e.label}
                        onClick={(ev) => { ev.stopPropagation(); startEdit(e); }}
                      >
                        {e.label.slice(0, 6)}
                      </span>
                    ))}
                    {evts.length > 2 && <span style={{ fontSize: 9, color: "#999" }}>+{evts.length - 2}</span>}
                  </button>
                );
              });
            })()}
          </div>
        </div>
      )}

      {/* カテゴリ管理 */}
      {!loading && (
        <div style={{ marginBottom: 24, padding: 16, background: "#f8f9fa", borderRadius: 12, border: "1px solid #e5e5e5", overflow: "hidden", minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>カテゴリ管理</span>
            <button
              type="button"
              onClick={() => {
                setCatEditing(null);
                setCatAdding(true);
                setCatForm({ value: "", label: "", color: "#e5e7eb" });
              }}
              style={{ ...style.btn, padding: "6px 12px", fontSize: 13, background: "#3d6b6b", color: "#fff", border: "none", flexShrink: 0 }}
            >
              ＋ カテゴリ追加
            </button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-start", minWidth: 0 }}>
            {/* 既存カテゴリ一覧 */}
            <div style={{ flex: "1 1 200px", minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#666", marginBottom: 8 }}>既存カテゴリ</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexWrap: "wrap", gap: 8 }}>
                {categories.map((c) => (
                  <li
                    key={c.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 12px",
                      background: "#fff",
                      borderRadius: 8,
                      border: "1px solid #e5e5e5",
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ width: 16, height: 16, borderRadius: 4, background: c.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.label}</span>
                    <span style={{ fontSize: 11, color: "#888", flexShrink: 0 }}>({c.value})</span>
                    <button type="button" onClick={() => { setCatAdding(false); setCatEditing(c); setCatForm({ value: c.value, label: c.label, color: c.color }); }} style={{ ...style.btn, padding: "4px 8px", fontSize: 12, background: "#fff", color: "#3d6b6b", border: "1px solid #3d6b6b", flexShrink: 0 }}>編集</button>
                    <button type="button" onClick={() => removeCategory(c.id)} disabled={saving} style={{ ...style.btn, padding: "4px 8px", fontSize: 12, background: "#fff", color: "#c00", border: "1px solid #c00", flexShrink: 0 }}>削除</button>
                  </li>
                ))}
                {categories.length === 0 && <span style={{ fontSize: 13, color: "#999" }}>カテゴリがありません</span>}
              </ul>
            </div>
            {/* 追加・編集フォーム */}
            {(catAdding || catEditing) && (
              <div style={{ flex: "1 1 280px", minWidth: 0, padding: 12, background: "#fff", borderRadius: 8, border: "1px solid #e5e5e5", overflow: "hidden" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#666", marginBottom: 8 }}>{catEditing ? "編集" : "新規追加"}</div>
                <div style={{ display: "grid", gap: 8, marginBottom: 8 }}>
                  <div style={{ minWidth: 0 }}>
                    <label style={{ display: "block", fontSize: 12, marginBottom: 4 }}>カテゴリID（英小文字・ハイフン）</label>
                    <input type="text" value={catForm.value} onChange={(e) => setCatForm((prev) => ({ ...prev, value: e.target.value }))} placeholder="例: cat-tsushin" style={{ ...style.input }} autoComplete="off" />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <label style={{ display: "block", fontSize: 12, marginBottom: 4 }}>表示名（カレンダーに表示）</label>
                    <input type="text" value={catForm.label} onChange={(e) => setCatForm((prev) => ({ ...prev, label: e.target.value }))} placeholder="例: 通信講座" style={{ ...style.input }} autoComplete="off" />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <label style={{ display: "block", fontSize: 12, marginBottom: 4 }}>表示色</label>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <input
                        type="color"
                        value={/^#[0-9A-Fa-f]{6}$/.test(catForm.color) ? catForm.color : "#e5e7eb"}
                        onChange={(e) => setCatForm((prev) => ({ ...prev, color: e.target.value }))}
                        style={{ width: 40, height: 36, padding: 2, border: "1px solid #ddd", borderRadius: 6, cursor: "pointer" }}
                      />
                      <input type="text" value={catForm.color} onChange={(e) => setCatForm((prev) => ({ ...prev, color: e.target.value }))} placeholder="例: #2563eb" style={{ ...style.input, maxWidth: 120 }} autoComplete="off" />
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button type="button" onClick={saveCategory} disabled={saving} style={{ ...style.btn, padding: "6px 12px", background: "#3d6b6b", color: "#fff", border: "none" }}>保存</button>
                  <button type="button" onClick={() => { setCatEditing(null); setCatAdding(false); }} style={{ ...style.btn, padding: "6px 12px", background: "#fff", color: "#666", border: "1px solid #ddd" }}>キャンセル</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={async () => {
            setSaving(true);
            try {
              const r = await fetch("/api/admin/db-sync", { method: "POST" });
              const j = await r.json();
              if (r.ok) alert(j.message || "DBスキーマを適用しました");
              else alert(j.error || "失敗");
              load();
            } catch {
              alert("失敗");
            } finally {
              setSaving(false);
            }
          }}
          disabled={saving || loading}
          style={{ ...style.btn, background: "#fff", color: "#6b3d3d", border: "1px solid #6b3d3d" }}
        >
          DBスキーマ適用
        </button>
        <button
          type="button"
          onClick={async () => {
            setSaving(true);
            try {
              const r = await fetch("/api/seed/schedule/categories", { method: "POST" });
              const j = await r.json();
              if (r.ok) alert(j.message || "カテゴリを登録しました");
              else alert(j.error || "失敗");
              load();
            } catch {
              alert("失敗");
            } finally {
              setSaving(false);
            }
          }}
          disabled={saving || loading}
          style={{ ...style.btn, background: "#fff", color: "#3d6b6b", border: "1px solid #3d6b6b" }}
        >
          カテゴリ初期データを登録
        </button>
        <button
          type="button"
          onClick={async () => {
            setSaving(true);
            try {
              const r = await fetch("/api/seed/schedule", { method: "POST" });
              const j = await r.json();
              if (r.ok) alert("初期データを登録しました（" + (j.recurring + j.single) + "件）");
              else alert(j.error || "失敗");
              load();
            } catch {
              alert("失敗");
            } finally {
              setSaving(false);
            }
          }}
          disabled={saving || loading}
          style={{ ...style.btn, background: "#fff", color: "#3d6b6b", border: "1px solid #3d6b6b" }}
        >
          イベント初期データを登録
        </button>
      </div>

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
              ＋ イベントを追加
            </button>
          </div>

          {(editing || adding) && (
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="form-title"
              onMouseDown={(e) => e.target === e.currentTarget && cancelEdit()}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                padding: 24,
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: "#fff",
                  padding: 24,
                  borderRadius: 12,
                  maxWidth: 560,
                  width: "100%",
                  maxHeight: "90vh",
                  overflowY: "auto",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h3 id="form-title" style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{editing ? "編集" : "新規追加"}</h3>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    style={{ padding: "4px 8px", border: "none", background: "transparent", cursor: "pointer", fontSize: 20, lineHeight: 1, color: "#666" }}
                    aria-label="閉じる"
                  >
                    ×
                  </button>
                </div>
                <div style={{ display: "grid", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontSize: 13, fontWeight: 500 }}>種別</label>
                    <select
                      value={form.eventType}
                      onChange={(e) => setForm({ ...form, eventType: e.target.value as "recurring" | "single" })}
                      style={style.input}
                    >
                      <option value="recurring">定期（毎週・隔週）</option>
                      <option value="single">単発</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontSize: 13, fontWeight: 500 }}>講座名</label>
                    <input
                      type="text"
                      value={form.label}
                      onChange={(e) => setForm({ ...form, label: e.target.value })}
                      placeholder="例: 通信音読トレーニング"
                      style={style.input}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontSize: 13, fontWeight: 500 }}>カテゴリ（色）</label>
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start", minWidth: 0 }}>
                      <select value={form.cat} onChange={(e) => setForm({ ...form, cat: e.target.value })} style={{ ...style.input, flex: 1, minWidth: 0 }}>
                        <option value="">— 選択 —</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.value}>{c.label}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => {
                          setShowInlineCatAdd(!showInlineCatAdd);
                          if (!showInlineCatAdd) setInlineCatForm({ value: "", label: "", color: "#e5e7eb" });
                        }}
                        style={{ ...style.btn, padding: "8px 12px", background: showInlineCatAdd ? "#e8f0f0" : "#fff", color: "#3d6b6b", border: "1px solid #3d6b6b", flexShrink: 0 }}
                        title="カテゴリを追加"
                      >
                        ＋
                      </button>
                    </div>
                    {showInlineCatAdd && (
                      <div style={{ marginTop: 8, padding: 12, background: "#f8f9fa", borderRadius: 8, border: "1px solid #e5e5e5" }}>
                        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>新規カテゴリ追加</div>
                        <div style={{ display: "grid", gap: 8, marginBottom: 8 }}>
                          <div>
                            <label style={{ fontSize: 12, display: "block", marginBottom: 2 }}>カテゴリID（英小文字・ハイフン）</label>
                            <input type="text" value={inlineCatForm.value} onChange={(e) => setInlineCatForm({ ...inlineCatForm, value: e.target.value })} placeholder="例: cat-jokyu1" style={{ ...style.input }} />
                          </div>
                          <div>
                            <label style={{ fontSize: 12, display: "block", marginBottom: 2 }}>表示名（カレンダーに表示）</label>
                            <input type="text" value={inlineCatForm.label} onChange={(e) => setInlineCatForm({ ...inlineCatForm, label: e.target.value })} placeholder="例: 上級・会話強化" style={{ ...style.input }} />
                          </div>
                          <div>
                            <label style={{ fontSize: 12, display: "block", marginBottom: 2 }}>表示色</label>
                            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                              <input
                                type="color"
                                value={/^#[0-9A-Fa-f]{6}$/.test(inlineCatForm.color) ? inlineCatForm.color : "#e5e7eb"}
                                onChange={(e) => setInlineCatForm({ ...inlineCatForm, color: e.target.value })}
                                style={{ width: 40, height: 36, padding: 2, border: "1px solid #ddd", borderRadius: 6, cursor: "pointer" }}
                              />
                              <input type="text" value={inlineCatForm.color} onChange={(e) => setInlineCatForm({ ...inlineCatForm, color: e.target.value })} placeholder="例: #0891b2" style={{ ...style.input, maxWidth: 100 }} />
                            </div>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button type="button" onClick={addCategoryFromDialog} disabled={saving} style={{ ...style.btn, padding: "6px 12px", fontSize: 13, background: "#3d6b6b", color: "#fff", border: "none" }}>追加</button>
                          <button type="button" onClick={() => setShowInlineCatAdd(false)} style={{ ...style.btn, padding: "6px 12px", fontSize: 13, background: "#fff", color: "#666", border: "1px solid #ddd" }}>キャンセル</button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontSize: 13, fontWeight: 500 }}>時間・備考</label>
                    <input
                      type="text"
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                      placeholder="例: 14:00〜, 随時受付中"
                      style={style.input}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontSize: 13, fontWeight: 500 }}>詳細（ツールチップ）</label>
                    <input
                      type="text"
                      value={form.detail}
                      onChange={(e) => setForm({ ...form, detail: e.target.value })}
                      placeholder="例: 毎週土曜 14:00〜 会話強化"
                      style={style.input}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontSize: 13, fontWeight: 500 }}>リンク先</label>
                    <input
                      type="text"
                      value={form.url}
                      onChange={(e) => setForm({ ...form, url: e.target.value })}
                      placeholder="例: kaiwa.html, group.html#tab05"
                      style={style.input}
                    />
                  </div>
                  {form.eventType === "recurring" && (
                    <>
                      <div>
                        <label style={{ display: "block", marginBottom: 4, fontSize: 13, fontWeight: 500 }}>曜日</label>
                        <select value={form.dow} onChange={(e) => setForm({ ...form, dow: parseInt(e.target.value, 10) })} style={style.input}>
                          {DOW_LABELS.map((l, i) => (
                            <option key={i} value={i}>{l}曜日</option>
                          ))}
                        </select>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                          <input
                            type="checkbox"
                            checked={form.biweekly}
                            onChange={(e) => setForm({ ...form, biweekly: e.target.checked })}
                          />
                          隔週
                        </label>
                        {form.biweekly && (
                          <input
                            type="date"
                            value={form.biweeklyStartDate}
                            onChange={(e) => setForm({ ...form, biweeklyStartDate: e.target.value })}
                            style={{ ...style.input, width: 160 }}
                            placeholder="基準日"
                          />
                        )}
                      </div>
                      <div>
                        <label style={{ display: "block", marginBottom: 4, fontSize: 13, fontWeight: 500 }}>毎月の週</label>
                        <select value={form.monthlyWeeks} onChange={(e) => setForm({ ...form, monthlyWeeks: e.target.value })} style={style.input}>
                          {MONTHLY_WEEKS_OPTIONS.map((o) => (
                            <option key={o.value || "all"} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label style={{ display: "block", marginBottom: 4, fontSize: 13, fontWeight: 500 }}>終了日</label>
                        <input
                          type="date"
                          value={form.endDate}
                          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                          style={style.input}
                          placeholder="例: 2026-12-31（空欄なら無期限）"
                        />
                      </div>
                    </>
                  )}
                  {form.eventType === "single" && (
                    <div>
                      <label style={{ display: "block", marginBottom: 4, fontSize: 13, fontWeight: 500 }}>日付</label>
                      <input
                        type="date"
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        style={style.input}
                      />
                    </div>
                  )}
                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontSize: 13, fontWeight: 500 }}>表示順</label>
                    <input
                      type="number"
                      value={form.sortOrder}
                      onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value, 10) || 0 })}
                      style={{ ...style.input, width: 100 }}
                    />
                  </div>
                  <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                    <button type="button" onClick={save} disabled={saving} style={{ ...style.btn, background: "#3d6b6b", color: "#fff", border: "none" }}>
                      {saving ? "保存中…" : "保存"}
                    </button>
                    <button type="button" onClick={cancelEdit} style={{ ...style.btn, background: "#fff", color: "#3d6b6b", border: "1px solid #3d6b6b" }}>
                      キャンセル
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div style={{ marginBottom: 16, fontSize: 14, fontWeight: 600 }}>定期イベント</div>
          <ul style={{ listStyle: "none", padding: 0, marginBottom: 24 }}>
            {list.filter((e) => e.eventType === "recurring").map((v) => (
              <li
                key={v.id}
                style={{
                  padding: 14,
                  marginBottom: 8,
                  background: "#fff",
                  border: "1px solid #e5e5e5",
                  borderRadius: 8,
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <span style={{ fontSize: 11, color: "#888", minWidth: 24 }}>{DOW_LABELS[v.dow ?? 0]}曜</span>
                <span style={{ fontWeight: 600, flex: 1, minWidth: 140 }}>{v.label}</span>
                <span style={{ fontSize: 12, color: "#666" }}>{v.time || "-"}</span>
                <span style={{ fontSize: 11, padding: "2px 8px", background: getCatColor(v.cat) + "33", borderRadius: 4, color: getCatColor(v.cat) }}>
                  {getCatLabel(v.cat)}
                </span>
                {v.biweekly && <span style={{ fontSize: 11, color: "#c00" }}>隔週</span>}
                {v.monthlyWeeks && <span style={{ fontSize: 11, color: "#666" }}>{v.monthlyWeeks === "1,3" ? "1・3週" : v.monthlyWeeks === "2,4" ? "2・4週" : ""}</span>}
                {v.endDate && <span style={{ fontSize: 11, color: "#888" }}>〜{v.endDate}</span>}
                <div style={{ display: "flex", gap: 8 }}>
                  <button type="button" onClick={() => startEdit(v)} style={{ ...style.btn, padding: "6px 12px", fontSize: 13, background: "#fff", color: "#3d6b6b", border: "1px solid #3d6b6b" }}>編集</button>
                  <button type="button" onClick={() => remove(v.id)} disabled={saving} style={{ ...style.btn, padding: "6px 12px", fontSize: 13, background: "#fff", color: "#c00", border: "1px solid #c00" }}>削除</button>
                </div>
              </li>
            ))}
          </ul>

          <div style={{ marginBottom: 16, fontSize: 14, fontWeight: 600 }}>単発イベント</div>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {list.filter((e) => e.eventType === "single").map((v) => (
              <li
                key={v.id}
                style={{
                  padding: 14,
                  marginBottom: 8,
                  background: "#fff",
                  border: "1px solid #e5e5e5",
                  borderRadius: 8,
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 600, minWidth: 100 }}>{v.date}</span>
                <span style={{ fontWeight: 600, flex: 1, minWidth: 140 }}>{v.label}</span>
                <span style={{ fontSize: 12, color: "#666" }}>{v.time || "-"}</span>
                <span style={{ fontSize: 11, padding: "2px 8px", background: getCatColor(v.cat) + "33", borderRadius: 4, color: getCatColor(v.cat) }}>
                  {getCatLabel(v.cat)}
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  <button type="button" onClick={() => startEdit(v)} style={{ ...style.btn, padding: "6px 12px", fontSize: 13, background: "#fff", color: "#3d6b6b", border: "1px solid #3d6b6b" }}>編集</button>
                  <button type="button" onClick={() => remove(v.id)} disabled={saving} style={{ ...style.btn, padding: "6px 12px", fontSize: 13, background: "#fff", color: "#c00", border: "1px solid #c00" }}>削除</button>
                </div>
              </li>
            ))}
          </ul>

          {list.length === 0 && !loading && (
            <p style={{ color: "#666", padding: 24 }}>イベントがありません。「＋ イベントを追加」または「初期データを登録」から登録してください。</p>
          )}
        </>
      )}
    </div>
  );
}
