const MIRINAE_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mirinae-jp.vercel.app";

export const metadata = {
  title: "ミリネ韓国語教室",
  description: "ミリネ韓国語教室 | 東京で韓国語教室をお探しならミリネ。",
  icons: { icon: "/favicon.png" },
  openGraph: {
    title: "ミリネ韓国語教室 | 東京で韓国語教室をお探しならミリネ",
    description: "「話せる」を、ここで実現する。経験豊富な講師陣と、個人に合わせた多彩な講座であなたの韓国語を、確実に伸ばします。",
    url: MIRINAE_SITE_URL,
    siteName: "ミリネ韓国語教室",
    images: [
      { url: `${MIRINAE_SITE_URL}/favicon.png`, width: 64, height: 64, alt: "ミリネ韓国語教室" },
    ],
  },
  twitter: {
    card: "summary",
    images: [`${MIRINAE_SITE_URL}/favicon.png`],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body style={{ margin: 0, fontFamily: "'Noto Sans JP', sans-serif", background: "#f5f5f5" }}>
        {children}
      </body>
    </html>
  );
}
