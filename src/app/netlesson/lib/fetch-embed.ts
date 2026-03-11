/**
 * ISR용: 외부 페이지(writing.mirinae.jp, ondoku.mirinae.jp) HTML을 fetch하여
 * 메인 콘텐츠를 추출합니다. revalidate와 함께 사용하여 주기적으로 갱신됩니다.
 */

const EXTERNAL_URLS = {
  writing: "https://writing.mirinae.jp/?embed=1",
  ondoku: "https://ondoku.mirinae.jp/?embed=1",
  topik: "https://writing.mirinae.jp/?tab=topik&embed=1",
} as const;

export type EmbedSource = keyof typeof EXTERNAL_URLS;

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; MirinaeBot/1.0)" },
    next: { revalidate: 60 }, // ISR: 60초마다 재검증
  });
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return res.text();
}

/**
 * HTML에서 script/style 제거 후 body 또는 main 콘텐츠 추출
 */
function extractMainContent(html: string, baseUrl: string): string {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const cheerio = require("cheerio");
    const $ = cheerio.load(html);

    // script, style, noscript 제거
    $("script, style, noscript, iframe").remove();

    // main 또는 [role="main"] 또는 body 우선
    let main =
      $("main").html() ||
      $('[role="main"]').html() ||
      $("body").html() ||
      "";

    // base URL 보정 (상대 경로 -> 절대 경로)
    const base = new URL(baseUrl);
    main = main.replace(
      /(href|src)=["'](?!https?:|\/\/|#|mailto:)([^"']*)["']/gi,
      (_match: string, attr: string, path: string) => `${attr}="${new URL(path, base.origin).href}"`
    );

    return main || "<p>コンテンツを読み込めませんでした。</p>";
  } catch {
    // cheerio 미설치 시 단순 추출
    const noScript = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
    const bodyMatch = noScript.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    return bodyMatch ? bodyMatch[1] : "<p>コンテンツを読み込めませんでした。</p>";
  }
}

export async function fetchEmbedContent(
  source: EmbedSource
): Promise<{ html: string; url: string }> {
  const url = EXTERNAL_URLS[source];
  const raw = await fetchHtml(url);
  const html = extractMainContent(raw, url);
  return { html, url };
}

export { EXTERNAL_URLS };
