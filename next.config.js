/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true, // /b/ を /b にリダイレクトしない（ループ防止）

  /** Global HTTP security headers (mirinae.jp scan / baseline CSP). */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
              "style-src 'self' 'unsafe-inline' https:",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data: https:",
              "connect-src 'self' https: wss:",
              "frame-src 'self' https:",
              "worker-src 'self' blob:",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self' https:",
            ].join("; "),
          },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "geolocation=(), camera=(), microphone=()",
          },
        ],
      },
    ];
  },

  // 廃止ページの 301 リダイレクト
  async redirects() {
    return [
      {
        source: "/faq.html",
        destination: "/cancel/#tab01",
        permanent: true, // 301 永久移動（FAQ内容は cancel ページに集約）
      },
      {
        source: "/contact.html",
        destination: "/trial/",
        permanent: true, // 301 永久移動（お問合せは trial ページへ）
      },
    ];
  },
  // www.mirinae.jp のトップ・各ページは public/*.html をクリーンURLで表示
  async rewrites() {
    const externalRewrites = [
      { source: "/qna", destination: "https://apps.mirinae.jp/qna" },
      { source: "/qna/:path*", destination: "https://apps.mirinae.jp/qna/:path*" },
      { source: "/dailylife", destination: "https://apps.mirinae.jp/dailylife" },
      { source: "/dailylife/:path*", destination: "https://apps.mirinae.jp/dailylife/:path*" },
      { source: "/quiz", destination: "https://quiz.mirinae.jp" },
      { source: "/quiz/:path*", destination: "https://quiz.mirinae.jp/:path*" },
      { source: "/ondoku", destination: "https://ondoku.mirinae.jp" },
      { source: "/ondoku/:path*", destination: "https://ondoku.mirinae.jp/:path*" },
      { source: "/sample-digital-correction.png", destination: "https://apps.mirinae.jp/sample-digital-correction.png" },
      // blog (mirinae.hippy.jp) - manage/manage-login は直接、それ以外はプロキシ経由で X-Forwarded-Host を渡す
      { source: "/blog/manage", destination: "https://mirinae.hippy.jp/blog/wp-admin" },
      { source: "/blog/manage/", destination: "https://mirinae.hippy.jp/blog/wp-admin/" },
      { source: "/blog/manage/:path*", destination: "https://mirinae.hippy.jp/blog/wp-admin/:path*" },
      { source: "/blog/manage-login", destination: "https://mirinae.hippy.jp/blog/wp-login.php" },
      { source: "/blog", destination: "/api/blog-proxy" },
      { source: "/blog/", destination: "/api/blog-proxy/" },
      { source: "/blog/:path*", destination: "/api/blog-proxy/:path*" },
      { source: "/wordpress/:path*", destination: "https://mirinae.hippy.jp/wordpress/:path*" },
    ];
    const htmlRoutes = [
      { source: "/", destination: "/index.html" },
      { source: "/about", destination: "/about.html" },
      { source: "/kojin", destination: "/kojin.html" },
      { source: "/group", destination: "/group.html" },
      { source: "/kaiwa", destination: "/kaiwa.html" },
      { source: "/special", destination: "/special.html" },
      { source: "/syutyu", destination: "/syutyu.html" },
      { source: "/trial", destination: "/trial.html" },
      { source: "/book", destination: "/book.html" },
      { source: "/cancel", destination: "/cancel.html" },
      { source: "/voice", destination: "/voice.html" },
      { source: "/netlesson", destination: "/netlesson.html" },
      { source: "/netlesson/", destination: "/netlesson.html" },
      { source: "/t", destination: "/index.html" },
      { source: "/t/", destination: "/index.html" },
      { source: "/t/about", destination: "/about.html" },
      { source: "/t/kojin", destination: "/kojin.html" },
      { source: "/t/group", destination: "/group.html" },
      { source: "/t/kaiwa", destination: "/kaiwa.html" },
      { source: "/t/special", destination: "/special.html" },
      { source: "/t/syutyu", destination: "/syutyu.html" },
      { source: "/t/trial", destination: "/trial.html" },
      { source: "/t/book", destination: "/book.html" },
      { source: "/t/cancel", destination: "/cancel.html" },
      { source: "/t/voice", destination: "/voice.html" },
    ];
    // beforeFiles でファイルシステムより先に適用（external rewrites + html）
    return { beforeFiles: [...externalRewrites, ...htmlRoutes] };
  },
};
module.exports = nextConfig;
