"use client";

import { useState } from "react";

export default function NewCampaignPage() {
  const [subject, setSubject] = useState("");
  const [preheader, setPreheader] = useState("");
  const [bodyHtml, setBodyHtml] = useState("<p>本文を入力してください。</p>");
  const [ctaLabel, setCtaLabel] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [testTo, setTestTo] = useState("");
  const [scheduleAt, setScheduleAt] = useState("");
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function saveDraft(): Promise<string | null> {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/newsletter/campaigns", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          preheader: preheader || null,
          bodyHtml,
          ctaLabel: ctaLabel || null,
          ctaUrl: ctaUrl || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "save failed");
      setCampaignId(data.id);
      setMsg(`下書きを保存しました（ID: ${data.id}）`);
      return data.id as string;
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "error");
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function patchDraft(id: string): Promise<void> {
    await fetch(`/api/admin/newsletter/campaigns/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject,
        preheader,
        bodyHtml,
        ctaLabel,
        ctaUrl,
      }),
    });
  }

  async function testSend() {
    setLoading(true);
    setMsg(null);
    try {
      const id = campaignId || (await saveDraft());
      if (!id) {
        setMsg("先に下書き保存してください");
        setLoading(false);
        return;
      }
      await patchDraft(id);
      const res = await fetch(`/api/admin/newsletter/campaigns/${id}/test`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: testTo }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "test failed");
      setMsg("テスト送信しました。");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "error");
    } finally {
      setLoading(false);
    }
  }

  async function scheduleSend() {
    if (!scheduleAt) {
      setMsg("予約日時を入力してください");
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const id = campaignId || (await saveDraft());
      if (!id) return;
      await patchDraft(id);
      const res = await fetch(`/api/admin/newsletter/campaigns/${id}/schedule`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scheduledAt: new Date(scheduleAt).toISOString() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "schedule failed");
      setMsg("予約しました。");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "error");
    } finally {
      setLoading(false);
    }
  }

  async function sendNow() {
    setLoading(true);
    setMsg(null);
    try {
      const id = campaignId || (await saveDraft());
      if (!id) return;
      await patchDraft(id);
      const res = await fetch(`/api/admin/newsletter/campaigns/${id}/send`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "send failed");
      setMsg("送信を開始しました（大量配信は数分かかる場合があります）。");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>件名</label>
      <input
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 16 }}
      />
      <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>プレヘッダー（任意）</label>
      <input
        value={preheader}
        onChange={(e) => setPreheader(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 16 }}
      />
      <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>本文 HTML</label>
      <textarea
        value={bodyHtml}
        onChange={(e) => setBodyHtml(e.target.value)}
        rows={12}
        style={{ width: "100%", padding: 8, marginBottom: 16, fontFamily: "monospace" }}
      />
      <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>CTA ラベル（任意）</label>
      <input
        value={ctaLabel}
        onChange={(e) => setCtaLabel(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 12 }}
      />
      <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>CTA URL（任意）</label>
      <input
        value={ctaUrl}
        onChange={(e) => setCtaUrl(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 20 }}
      />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        <button type="button" onClick={() => void saveDraft()} disabled={loading} style={btn}>
          下書き保存
        </button>
      </div>
      <hr style={{ margin: "24px 0" }} />
      <label style={{ display: "block", marginBottom: 8 }}>テスト送信先メール</label>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <input
          type="email"
          value={testTo}
          onChange={(e) => setTestTo(e.target.value)}
          placeholder="you@example.com"
          style={{ flex: 1, minWidth: 200, padding: 8 }}
        />
        <button type="button" onClick={() => void testSend()} disabled={loading} style={btn}>
          テスト送信
        </button>
      </div>
      <hr style={{ margin: "24px 0" }} />
      <label style={{ display: "block", marginBottom: 8 }}>予約送信（ローカル日時）</label>
      <input
        type="datetime-local"
        value={scheduleAt}
        onChange={(e) => setScheduleAt(e.target.value)}
        style={{ padding: 8, marginBottom: 8 }}
      />
      <button type="button" onClick={() => void scheduleSend()} disabled={loading} style={btn}>
        予約する
      </button>
      <hr style={{ margin: "24px 0" }} />
      <button type="button" onClick={() => void sendNow()} disabled={loading} style={{ ...btn, background: "#8b2942" }}>
        今すぐ全員に送信
      </button>
      {msg && (
        <p style={{ marginTop: 16, color: "#333", whiteSpace: "pre-wrap" }}>
          {msg}
        </p>
      )}
    </div>
  );
}

const btn: React.CSSProperties = {
  padding: "10px 18px",
  background: "#3d6b6b",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};
