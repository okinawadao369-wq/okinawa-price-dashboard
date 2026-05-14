export type RssIntelItem = {
  title: string;
  link: string;
  publishedAt: string;
};

export type RssIntelSource = {
  id: string;
  label: string;
  url: string;
  status: "live" | "fallback";
  quality: "observed" | "fallback";
  articleCount: number;
  riskHits: number;
  positiveHits: number;
  score: number;
  items: RssIntelItem[];
  error?: string;
};

export type RssIntelResult = {
  startedAt: string;
  fetchedAt: string;
  liveCount: number;
  total: number;
  riskScore: number;
  sources: RssIntelSource[];
};

const cacheKey = "rssIntelCache";

export function fallbackRssIntel(): RssIntelResult {
  return {
    startedAt: new Date().toISOString(),
    fetchedAt: new Date().toISOString(),
    liveCount: 0,
    total: 3,
    riskScore: 40,
    sources: []
  };
}

export function getRssIntelCache() {
  try {
    const raw = localStorage.getItem(cacheKey);
    return raw ? (JSON.parse(raw) as RssIntelResult) : null;
  } catch {
    return null;
  }
}

export async function fetchRssIntel(): Promise<{ data: RssIntelResult; logs: string[] }> {
  const logs: string[] = [];
  try {
    const response = await fetch("/api/rss-intel");
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    const data = (await response.json()) as RssIntelResult;
    localStorage.setItem(cacheKey, JSON.stringify(data));
    logs.push(`RSS/ブラウジング調査更新完了: live ${data.liveCount}/${data.total}、risk ${data.riskScore}`);
    return { data, logs };
  } catch (error) {
    const cached = getRssIntelCache();
    if (cached) {
      logs.push(`RSS/ブラウジング調査取得失敗。前回キャッシュを使用: ${error instanceof Error ? error.message : "unknown"}`);
      return { data: cached, logs };
    }
    const fallback = fallbackRssIntel();
    logs.push(`RSS/ブラウジング調査取得失敗。fallbackを使用: ${error instanceof Error ? error.message : "unknown"}`);
    return { data: fallback, logs };
  }
}
