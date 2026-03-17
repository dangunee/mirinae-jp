"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginForm() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const displayError = error ?? searchParams.get("error");

  const message =
    displayError === "config"
      ? "管理者パスワードが設定されていません。ADMIN_PASSWORD を設定してください。"
      : displayError === "invalid"
        ? "パスワードが正しくありません。"
        : null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const password = (form.elements.namedItem("password") as HTMLInputElement)?.value;
    if (!password) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (data.ok) {
        window.location.href = "/admin/";
        return;
      }
      setError(data.error ?? "invalid");
    } catch {
      setError("invalid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: "60px auto" }}>
      <h1 style={{ fontSize: 22, marginBottom: 24 }}>管理画面ログイン</h1>
      {message && (
        <p style={{ color: "#c00", marginBottom: 16, fontSize: 14 }}>{message}</p>
      )}
      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", marginBottom: 8, fontSize: 14 }}>
          パスワード
        </label>
        <input
          type="password"
          name="password"
          required
          autoFocus
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px 12px",
            border: "1px solid #ddd",
            borderRadius: 8,
            marginBottom: 20,
            boxSizing: "border-box",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 12,
            background: "#3d6b6b",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "ログイン中…" : "ログイン"}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<p>読み込み中…</p>}>
      <LoginForm />
    </Suspense>
  );
}
