import Link from "next/link";

const LINKS: { href: string; label: string }[] = [
  { href: "/admin/newsletter/", label: "概要" },
  { href: "/admin/newsletter/campaigns/new/", label: "配信メール作成" },
  { href: "/admin/newsletter/scheduled/", label: "配信予約リスト" },
  { href: "/admin/newsletter/history/", label: "配信履歴・解析" },
  { href: "/admin/newsletter/subscribers/", label: "購読者管理" },
  { href: "/admin/newsletter/import/", label: "CSVインポート" },
];

/** Server-only nav (no usePathname) to avoid client hydration failures on /admin/newsletter*. */
export function NewsletterNav() {
  return (
    <nav
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 24,
        paddingBottom: 16,
        borderBottom: "1px solid #ddd",
      }}
    >
      {LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          style={{
            padding: "8px 14px",
            borderRadius: 6,
            textDecoration: "none",
            background: "#eee",
            color: "#222",
            fontSize: 14,
          }}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
