/**
 * ISR: 외부 페이지 HTML fetch + 메인 콘텐츠 추출 (클래스명 유지)
 * + head의 stylesheet URL 추출 → SSR 데이터 + 외부 CSS 조합
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
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return res.text();
}

function extractContentAndStyles(
  html: string,
  baseUrl: string
): { html: string; stylesheets: string[]; inlineStyles: string } {
  try {
    const cheerio = require("cheerio");
    const $ = cheerio.load(html);
    const base = new URL(baseUrl);

    // 1. head에서 stylesheet URL 추출 (절대 경로로 변환)
    const stylesheets: string[] = [];
    $('head link[rel="stylesheet"]').each((_idx: number, el: unknown) => {
      const href = (el as { attribs?: { href?: string } }).attribs?.href;
      if (href && !href.startsWith("data:")) {
        stylesheets.push(new URL(href, base.origin).href);
      }
    });

    // 2. style 태그 내용 추출 (제거 전에)
    const inlineStyles: string[] = [];
    $("style").each((_, el) => {
      const content = $(el).html();
      if (content?.trim()) inlineStyles.push(content.trim());
    });

    // 3. script, style, noscript, iframe 제거 (클래스명은 유지)
    $("script, style, noscript, iframe").remove();

    // 4. main 또는 body 콘텐츠 추출 (클래스명 그대로)
    let main =
      $("main").html() ||
      $('[role="main"]').html() ||
      $("body").html() ||
      "";

    // 5. 상대 경로 → 절대 경로
    main = main.replace(
      /(href|src)=["'](?!https?:|\/\/|#|mailto:)([^"']*)["']/gi,
      (_m: string, attr: string, path: string) => `${attr}="${new URL(path, base.origin).href}"`
    );

    return {
      html: main || "<p>コンテンツを読み込めませんでした。</p>",
      stylesheets,
      inlineStyles: inlineStyles.join("\n"),
    };
  } catch {
    const noScript = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
    const bodyMatch = noScript.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    return {
      html: bodyMatch ? bodyMatch[1] : "<p>コンテンツを読み込めませんでした。</p>",
      stylesheets: [],
      inlineStyles: "",
    };
  }
}

export async function fetchEmbedContent(source: EmbedSource): Promise<{
  html: string;
  url: string;
  stylesheets: string[];
  inlineStyles: string;
}> {
  const url = EXTERNAL_URLS[source];
  const raw = await fetchHtml(url);
  const { html, stylesheets, inlineStyles } = extractContentAndStyles(raw, url);
  return { html, url, stylesheets, inlineStyles };
}

export { EXTERNAL_URLS };
