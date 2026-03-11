"use client";

import { useEffect, useState } from "react";

const LEVELS = [
  { id: "shochukyu", label: "初中級" },
  { id: "chukyu1", label: "中級1" },
  { id: "chukyu2", label: "中級2" },
  { id: "jokyu", label: "上級" },
] as const;

type LevelId = (typeof LEVELS)[number]["id"];

export default function KaiwaCurriculumAdminPage() {
  const [data, setData] = useState<Record<string, string[]>>({});
  const [activeLevel, setActiveLevel] = useState<LevelId>("shochukyu");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetch("/api/kaiwa-curriculum")
      .then((r) => r.json())
      .then((raw) => {
        const byLevel: Record<string, string[]> = {};
        for (const k of LEVELS.map((l) => l.id)) {
          byLevel[k] = (raw[k] ?? []).map((x: { theme: string }) => x.theme);
        }
        setData(byLevel);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const updateTheme = (level: LevelId, index: number, value: string) => {
    setData((prev) => {
      const arr = [...(prev[level] ?? [])];
      arr[index] = value;
      return { ...prev, [level]: arr };
    });
  };

  const addTheme = (level: LevelId) => {
    setData((prev) => ({
      ...prev,
      [level]: [...(prev[level] ?? []), ""],
    }));
  };

  const removeTheme = (level: LevelId, index: number) => {
    setData((prev) => ({
      ...prev,
      [level]: (prev[level] ?? []).filter((_, i) => i !== index),
    }));
  };

  const save = async () => {
    setSaving(true);
    try {
      for (const level of LEVELS.map((l) => l.id)) {
        await fetch("/api/kaiwa-curriculum", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ levelKey: level, themes: data[level] ?? [] }),
        });
      }
      alert("保存しました");
    } catch (e) {
      alert("エラー: " + String(e));
    } finally {
      setSaving(false);
    }
  };

  const runSeed = async () => {
    if (!confirm("シードを実行しますか？既存データは上書きされます。")) return;
    setSeeding(true);
    try {
      const r = await fetch("/api/seed/kaiwa-curriculum", { method: "POST" });
      const j = await r.json();
      if (r.ok) {
        alert("シード完了: " + JSON.stringify(j.counts));
        window.location.reload();
      } else {
        alert("エラー: " + (j.error ?? r.statusText));
      }
    } catch (e) {
      alert("エラー: " + String(e));
    } finally {
      setSeeding(false);
    }
  };

  const themes = data[activeLevel] ?? [];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 24, marginBottom: 24 }}>会話カリキュラム編集</h1>
      <p style={{ marginBottom: 16 }}>
        <a href="/kaiwa" style={{ color: "#4a6fa5", textDecoration: "none" }}>→ 会話ページを確認</a>
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <button
          type="button"
          onClick={runSeed}
          disabled={seeding}
          style={{
            padding: "10px 16px",
            background: "#666",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: seeding ? "wait" : "pointer",
          }}
        >
          {seeding ? "シード中…" : "mirinae.jp からシード"}
        </button>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          style={{
            padding: "10px 16px",
            background: "#2c2c2c",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: saving ? "wait" : "pointer",
          }}
        >
          {saving ? "保存中…" : "保存"}
        </button>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {LEVELS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveLevel(id)}
            style={{
              padding: "10px 16px",
              background: activeLevel === id ? "#B8963E" : "#eee",
              color: activeLevel === id ? "#fff" : "#333",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            {label}
          </button>
        ))}
      </div>
      {loading ? (
        <p>読み込み中…</p>
      ) : (
        <div>
          <h2 style={{ fontSize: 18, marginBottom: 16 }}>{LEVELS.find((l) => l.id === activeLevel)?.label}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {themes.map((theme, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ width: 32, color: "#666" }}>{i + 1}</span>
                <input
                  type="text"
                  value={theme}
                  onChange={(e) => updateTheme(activeLevel, i, e.target.value)}
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    fontSize: 14,
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeTheme(activeLevel, i)}
                  style={{
                    padding: "8px 12px",
                    background: "#dc3545",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: 12,
                  }}
                >
                  削除
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => addTheme(activeLevel)}
            style={{
              marginTop: 16,
              padding: "10px 16px",
              background: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            + テーマ追加
          </button>
        </div>
      )}
    </div>
  );
}
