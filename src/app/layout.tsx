export const metadata = { title: "ミリネ韓国語教室", description: "ミリネ韓国語教室" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body style={{ margin: 0, fontFamily: "'Noto Sans JP', sans-serif", background: "#f5f5f5" }}>
        {children}
      </body>
    </html>
  );
}
