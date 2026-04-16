"use client";

export default function AdminNewsletterError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("[admin/newsletter] error boundary", error);
  return (
    <div style={{ padding: 16, background: "#fff3cd", borderRadius: 8 }}>
      <p style={{ fontWeight: 600, marginBottom: 8 }}>メール配信エリアの表示エラー</p>
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
