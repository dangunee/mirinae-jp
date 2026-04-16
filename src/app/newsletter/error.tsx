"use client";

export default function NewsletterPublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("[newsletter] error boundary", error);
  return (
    <div
      style={{
        maxWidth: 560,
        margin: "48px auto",
        padding: 24,
        background: "#fff3cd",
        borderRadius: 8,
      }}
    >
      <p style={{ fontWeight: 600, marginBottom: 8 }}>ページの表示エラー</p>
      <p style={{ fontSize: 14, color: "#333", marginBottom: 12 }}>
        {error.message || "不明なエラー"}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        style={{
          padding: "8px 16px",
          background: "#3d6b6b",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        再試行
      </button>
    </div>
  );
}
