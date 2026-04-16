"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginForm() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"password" | "otp">("password");
  const displayError = error ?? searchParams.get("error");

  const message =
    displayError === "config"
      ? "管理者パスワードが設定されていません。ADMIN_PASSWORD を設定してください。"
      : displayError === "invalid"
        ? step === "otp"
          ? "コードが正しくありません。"
          : "パスワードが正しくありません。"
        : displayError === "expired"
          ? "セッションが切れました。最初からやり直してください。"
          : displayError === "email_failed"
            ? "メール送信に失敗しました。GMAIL_USER / GMAIL_APP_PASSWORD（または RESEND_API_KEY）を確認してください。"
            : null;

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
        if (data.requiresOtp) {
          setStep("otp");
        } else {
          window.location.href = "/admin/";
          return;
        }
      } else {
        setError(data.error ?? "invalid");
      }
    } catch {
      setError("invalid");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const otp = (form.elements.namedItem("otp") as HTMLInputElement)?.value?.trim();
    if (!otp) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
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

  const inputStyle = {
    width: "100%" as const,
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: 8,
    marginBottom: 20,
    boxSizing: "border-box" as const,
  };

  const buttonStyle = {
    width: "100%" as const,
    padding: 12,
    background: "#3d6b6b",
    color: "#fff",
    border: "none" as const,
    borderRadius: 8,
    cursor: "pointer" as const,
  };

  if (step === "otp") {
    return (
      <div style={{ maxWidth: 360, margin: "60px auto" }}>
        <h1 style={{ fontSize: 22, marginBottom: 24 }}>確認コードを入力</h1>
        <p style={{ fontSize: 14, color: "#666", marginBottom: 20 }}>
          登録メールアドレスに6桁のコードを送信しました。
        </p>
        {message && (
          <p style={{ color: "#c00", marginBottom: 16, fontSize: 14 }}>{message}</p>
        )}
        <form onSubmit={handleOtpSubmit}>
          <label style={{ display: "block", marginBottom: 8, fontSize: 14 }}>
            確認コード
          </label>
          <input
            type="text"
            name="otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="123456"
            required
            autoFocus
            disabled={loading}
            style={inputStyle}
          />
          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? "確認中…" : "ログイン"}
          </button>
        </form>
        <button
          type="button"
          onClick={() => setStep("password")}
          style={{
            marginTop: 16,
            background: "none",
            border: "none",
            color: "#666",
            fontSize: 14,
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          ← パスワード入力に戻る
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 360, margin: "60px auto" }}>
      <h1 style={{ fontSize: 22, marginBottom: 24 }}>管理画面ログイン</h1>
      {message && (
        <p style={{ color: "#c00", marginBottom: 16, fontSize: 14 }}>{message}</p>
      )}
      <form onSubmit={handlePasswordSubmit}>
        <label style={{ display: "block", marginBottom: 8, fontSize: 14 }}>
          パスワード
        </label>
        <input
          type="password"
          name="password"
          required
          autoFocus
          disabled={loading}
          style={inputStyle}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ ...buttonStyle, cursor: loading ? "not-allowed" : "pointer" }}
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
