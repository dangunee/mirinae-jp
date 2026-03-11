/** @type {import('next').NextConfig} */
const nextConfig = {
  // www.mirinae.jp のトップ・各ページは public/*.html をクリーンURLで表示
  async rewrites() {
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
    // beforeFiles でファイルシステムより先に適用し、/ を index.html に
    return { beforeFiles: htmlRoutes };
  },
};
module.exports = nextConfig;
