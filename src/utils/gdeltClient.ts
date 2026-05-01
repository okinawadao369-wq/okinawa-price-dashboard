import { newsTopics, type NewsTopic } from "../data/baseData";
import { clamp } from "./pricingEngine";

export type NewsArticle = {
  title: string;
  url: string;
  domain?: string;
  seendate?: string;
};

export type TopicScore = {
  id: string;
  label: string;
  query: string;
  scoreRole: NewsTopic["scoreRole"];
  articleCount: number;
  riskWordHits: number;
  positiveWordHits: number;
  score: number;
  status: "live" | "fallback" | "cache";
  articles: NewsArticle[];
};

const riskWords = ["missile", "nuclear", "war", "attack", "drill", "exercise", "deployment", "blockade", "invasion", "sanction", "tariff", "inflation", "layoff", "shutdown", "protest", "incident", "warning", "crisis", "tension", "military", "budget"];
const positiveWords = ["agreement", "dialogue", "cooperation", "stable", "growth", "cooling", "decline", "easing", "peace", "support"];
const cacheKey = "gdeltNewsCache";

const hits = (text: string, words: string[]) => words.reduce((sum, word) => sum + (text.toLowerCase().match(new RegExp(`\\b${word}\\b`, "g"))?.length ?? 0), 0);

export function scoreTopic(topic: NewsTopic, articles: NewsArticle[]) {
  const body = articles.map((a) => `${a.title} ${a.domain ?? ""}`).join(" ");
  const riskWordHits = hits(body, riskWords);
  const positiveWordHits = hits(body, positiveWords);
  const score = clamp((18 + Math.log(1 + articles.length) * 18 + riskWordHits * 1.9 - positiveWordHits * 0.9) * topic.weight, 0, 100);
  return { riskWordHits, positiveWordHits, score };
}

export function fallbackGdelt(): TopicScore[] {
  return newsTopics.map((topic, index) => ({
    id: topic.id,
    label: topic.label,
    query: topic.query,
    scoreRole: topic.scoreRole,
    articleCount: 8 + index,
    riskWordHits: 5 + index,
    positiveWordHits: 1,
    score: clamp(48 + index * 4, 0, 100),
    status: "fallback",
    articles: []
  }));
}

export const getGdeltCache = () => {
  try {
    const raw = localStorage.getItem(cacheKey);
    return raw ? (JSON.parse(raw) as TopicScore[]) : null;
  } catch {
    return null;
  }
};

export async function fetchGdelt(timespan: string): Promise<{ data: TopicScore[]; logs: string[] }> {
  const logs: string[] = [];
  const results = await Promise.all(
    newsTopics.map(async (topic) => {
      const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(topic.query)}&mode=artlist&format=json&maxrecords=50&sort=datedesc&timespan=${timespan}&sourcelang=english`;
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const json = (await res.json()) as { articles?: NewsArticle[] };
        const articles = (json.articles ?? []).slice(0, 12);
        const scored = scoreTopic(topic, articles);
        return { id: topic.id, label: topic.label, query: topic.query, scoreRole: topic.scoreRole, articleCount: json.articles?.length ?? articles.length, ...scored, status: "live" as const, articles };
      } catch (error) {
        logs.push(`${topic.label} GDELT取得失敗: ${error instanceof Error ? error.message : "unknown"}。fallback/キャッシュを使用。`);
        const cached = getGdeltCache()?.find((c) => c.id === topic.id);
        if (cached) return { ...cached, status: "cache" as const };
        return fallbackGdelt().find((f) => f.id === topic.id)!;
      }
    })
  );
  localStorage.setItem(cacheKey, JSON.stringify(results));
  localStorage.setItem("lastUpdated", new Date().toISOString());
  logs.push(`GDELT更新完了: ${results.filter((r) => r.status === "live").length}/${results.length}トピック`);
  return { data: results, logs };
}

export function aggregateNews(scores: TopicScore[]) {
  const avg = (role?: TopicScore["scoreRole"]) => {
    const list = role ? scores.filter((s) => s.scoreRole === role) : scores;
    return list.length ? list.reduce((sum, s) => sum + s.score, 0) / list.length : 50;
  };
  return {
    geoRisk: avg(),
    eastAsiaTension: avg("eastAsiaTension"),
    forwardPosture: avg("forwardPosture"),
    okinawaBase: avg("okinawaBase"),
    consumerStress: avg("consumerStress"),
    marketRisk: avg("marketRisk")
  };
}
