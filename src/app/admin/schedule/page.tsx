"use client";

import { useEffect, useState } from "react";

const CAT_OPTIONS = [
  { value: "cat-tsushin", label: "通信講座" },
  { value: "cat-jokyu", label: "上級・会話強化" },
  { value: "cat-group", label: "グループレッスン" },
  { value: "cat-kojin", label: "個人レッスン" },
  { value: "cat-special", label: "集中・特別講座" },
] as const;

const DOW_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

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
  date: string;
  sortOrder: number;
} = {
  eventType: "recurring",
  label: "",
  cat: "cat-tsushin",
  time: "",
  detail: "",
  url: "",
  dow: 3,
  biweekly: false,
  biweeklyStartDate: "",
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

export default function ScheduleAdminPage() {
  const [list, setList] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<ScheduleEvent | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());

  const load = () => {
    setLoading(true);
    fetch("/api/admin/schedule")
      .then((r) => r.json())
      .then((data) => setList(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), []);

  const startAdd = () => {
    setEditing(null);
    setAdding(true);
    setForm({ ...defaultForm, sortOrder: list.length });
  };

  const startAddForDate = (y: number, m: number, d: number) => {
    const dateStr = dateKey(y, m, d);
    setEditing(null);
    setAdding(true);
    setForm({
      ...defaultForm,
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
      date: e.date || "",
      sortOrder: e.sortOrder,
    });
  };

  const cancelEdit = () => {
    setEditing(null);
    setAdding(false);
    setForm(defaultForm);
  };

  const save = async () => {
    if (!form.label.trim()) return alert("講座名を入力してください");
    if (!form.cat) return alert("カテゴリを選択してください");
    if (form.eventType === "recurring" && form.dow === undefined) return alert("曜日を選択してください");
    if (form.eventType === "single" && !form.date.trim()) return alert("日付を入力してください（YYYY-MM-DD）");
    setSaving(true);
    try {
      if (editing) {
        await fetch("/api/admin/schedule", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editing.id,
            ...form,
            biweeklyStartDate: form.biweekly ? form.biweeklyStartDate || null : null,
          }),
        });
      } else {
        await fetch("/api/admin/schedule", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            biweeklyStartDate: form.biweekly ? form.biweeklyStartDate || null : null,
          }),
        });
      }
      cancelEdit();
      load();
    } catch {
      alert("保存に失敗しました");
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
    input: { width: "100%", padding: "8px 12px", fontSize: 14, border: "1px solid #ddd", borderRadius: 6 } as React.CSSProperties,
    textarea: { width: "100%", padding: "8px 12px", fontSize: 14, border: "1px solid #ddd", borderRadius: 6, minHeight: 60 } as React.CSSProperties,
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
                          background: e.cat === "cat-tsushin" ? "#dbeafe" : e.cat === "cat-jokyu" ? "#cffafe" : e.cat === "cat-group" ? "#ede9fe" : e.cat === "cat-kojin" ? "#d1fae5" : e.cat === "cat-special" ? "#fee2e2" : "#e5e7eb",
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
              ＋ イベントを追加
            </button>
          </div>

          {(editing || adding) && (
            <div style={{ background: "#f8f8f8", padding: 24, borderRadius: 12, marginBottom: 24, border: "1px solid #e5e5e5" }}>
              <h3 style={{ marginBottom: 16, fontSize: 16 }}>{editing ? "編集" : "新規追加"}</h3>
              <div style={{ display: "grid", gap: 16, maxWidth: 600 }}>
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
                  <select value={form.cat} onChange={(e) => setForm({ ...form, cat: e.target.value })} style={style.input}>
                    {CAT_OPTIONS.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
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
                <div style={{ display: "flex", gap: 12 }}>
                  <button type="button" onClick={save} disabled={saving} style={{ ...style.btn, background: "#3d6b6b", color: "#fff", border: "none" }}>
                    {saving ? "保存中…" : "保存"}
                  </button>
                  <button type="button" onClick={cancelEdit} style={{ ...style.btn, background: "#fff", color: "#3d6b6b", border: "1px solid #3d6b6b" }}>
                    キャンセル
                  </button>
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
                <span style={{ fontSize: 11, padding: "2px 8px", background: "#e8f0f0", borderRadius: 4, color: "#3d6b6b" }}>
                  {CAT_OPTIONS.find((c) => c.value === v.cat)?.label || v.cat}
                </span>
                {v.biweekly && <span style={{ fontSize: 11, color: "#c00" }}>隔週</span>}
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
                <span style={{ fontSize: 11, padding: "2px 8px", background: "#e8f0f0", borderRadius: 4, color: "#3d6b6b" }}>
                  {CAT_OPTIONS.find((c) => c.value === v.cat)?.label || v.cat}
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
