/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true, // /b/ を /b にリダイレクトしない（ループ防止）
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
      { source: "/netlesson.html", destination: "/netlesson" },
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
