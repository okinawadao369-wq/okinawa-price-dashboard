const rssSources = [
  {
    id: "fed_monetary",
    label: "Federal Reserve monetary policy RSS",
    url: "https://www.federalreserve.gov/feeds/press_monetary.xml",
    weight: 1.15
  },
  {
    id: "fed_speeches",
    label: "Federal Reserve speeches RSS",
    url: "https://www.federalreserve.gov/feeds/speeches.xml",
    weight: 1.05
  },
  {
    id: "aljazeera",
    label: "Al Jazeera global RSS",
    url: "https://www.aljazeera.com/xml/rss/all.xml",
    weight: 1.2
  }
];

const riskWords = [
  "war", "attack", "missile", "nuclear", "invasion", "blockade", "sanction", "tariff", "inflation",
  "shutdown", "layoff", "crisis", "tension", "military", "budget", "fomc", "rate", "rates", "fed"
];
const positiveWords = ["agreement", "dialogue", "cooperation", "stable", "growth", "cooling", "decline", "easing", "peace", "support"];

function textBetween(item: string, tag: string) {
  const match = item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return decodeXml(match?.[1] ?? "").replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim();
}

function decodeXml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");
}

function countWords(text: string, words: string[]) {
  const lower = text.toLowerCase();
  return words.reduce((sum, word) => sum + (lower.match(new RegExp(`\\b${word}\\b`, "g"))?.length ?? 0), 0);
}

function parseItems(xml: string) {
  const itemMatches = [...xml.matchAll(/<item[\s\S]*?<\/item>/gi)].map((match) => match[0]);
  const entryMatches = [...xml.matchAll(/<entry[\s\S]*?<\/entry>/gi)].map((match) => match[0]);
  return [...itemMatches, ...entryMatches].slice(0, 20).map((item) => ({
    title: textBetween(item, "title"),
    link: textBetween(item, "link") || (item.match(/<link[^>]*href="([^"]+)"/i)?.[1] ?? ""),
    publishedAt: textBetween(item, "pubDate") || textBetween(item, "updated") || textBetween(item, "published")
  })).filter((item) => item.title);
}

export default async function handler(_req: any, res: any) {
  const startedAt = new Date().toISOString();
  const sources = await Promise.all(rssSources.map(async (source) => {
    try {
      const response = await fetch(source.url, {
        headers: {
          accept: "application/rss+xml, application/xml, text/xml",
          "user-agent": "okinawa-price-dashboard/1.0"
        }
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      const items = parseItems(await response.text());
      const joined = items.map((item) => item.title).join(" ");
      const riskHits = countWords(joined, riskWords);
      const positiveHits = countWords(joined, positiveWords);
      const score = Math.max(0, Math.min(100, Math.round((18 + Math.log1p(items.length) * 14 + riskHits * 2 - positiveHits) * source.weight)));
      return { ...source, status: "live", quality: "observed", articleCount: items.length, riskHits, positiveHits, score, items: items.slice(0, 6) };
    } catch (error) {
      return { ...source, status: "fallback", quality: "fallback", articleCount: 0, riskHits: 0, positiveHits: 0, score: 40, items: [], error: error instanceof Error ? error.message : "unknown" };
    }
  }));

  const liveCount = sources.filter((source) => source.status === "live").length;
  const riskScore = sources.length ? Math.round(sources.reduce((sum, source) => sum + source.score, 0) / sources.length) : 40;

  res.setHeader("Cache-Control", "s-maxage=900, stale-while-revalidate=3600");
  return res.status(200).json({
    startedAt,
    fetchedAt: new Date().toISOString(),
    liveCount,
    total: sources.length,
    riskScore,
    sources
  });
}
