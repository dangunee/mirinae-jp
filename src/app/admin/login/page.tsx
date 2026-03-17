"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const message =
    error === "config"
      ? "管理者パスワードが設定されていません。ADMIN_PASSWORD を設定してください。"
      : error === "invalid"
        ? "パスワードが正しくありません。"
        : null;

  return (
    <div style={{ maxWidth: 360, margin: "60px auto" }}>
      <h1 style={{ fontSize: 22, marginBottom: 24 }}>管理画面ログイン</h1>
      {message && (
        <p style={{ color: "#c00", marginBottom: 16, fontSize: 14 }}>{message}</p>
      )}
      <form method="post" action="/api/admin/login/">
        <label style={{ display: "block", marginBottom: 8, fontSize: 14 }}>
          パスワード
        </label>
        <input
          type="password"
          name="password"
          required
          autoFocus
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
          style={{
            width: "100%",
            padding: 12,
            background: "#3d6b6b",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          ログイン
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
