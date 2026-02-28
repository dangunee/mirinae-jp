/** @type {import('next').NextConfig} */
const nextConfig = {
  // www.mirinae.jp のトップ・各ページは public/*.html をクリーンURLで表示
  async rewrites() {
    return [
      { source: "/", destination: "/index.html" },
      { source: "/kojin", destination: "/kojin.html" },
      { source: "/group", destination: "/group.html" },
      { source: "/kaiwa", destination: "/kaiwa.html" },
      { source: "/special", destination: "/special.html" },
      { source: "/syutyu", destination: "/syutyu.html" },
      { source: "/trial", destination: "/trial.html" },
      { source: "/book", destination: "/book.html" },
      // mirinae.jp/t/ 用（作業中コンテンツを同じHTMLで表示）
      { source: "/t", destination: "/index.html" },
      { source: "/t/", destination: "/index.html" },
      { source: "/t/kojin", destination: "/kojin.html" },
      { source: "/t/group", destination: "/group.html" },
      { source: "/t/kaiwa", destination: "/kaiwa.html" },
      { source: "/t/special", destination: "/special.html" },
      { source: "/t/syutyu", destination: "/syutyu.html" },
      { source: "/t/trial", destination: "/trial.html" },
      { source: "/t/book", destination: "/book.html" },
    ];
  },
};
module.exports = nextConfig;
