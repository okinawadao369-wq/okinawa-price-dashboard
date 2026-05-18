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

type GdeltCacheEnvelope = {
  version: 4;
  date: string;
  timespan: string;
  attemptedAt: string;
  retryAfterMs: number;
  data: TopicScore[];
};

const riskWords = ["missile", "nuclear", "war", "attack", "drill", "exercise", "deployment", "blockade", "invasion", "sanction", "tariff", "inflation", "layoff", "shutdown", "protest", "incident", "warning", "crisis", "tension", "military", "budget", "deterrence", "readiness", "headquarters", "command", "interoperability", "alliance", "littoral", "stand-in"];
const positiveWords = ["agreement", "dialogue", "cooperation", "stable", "growth", "cooling", "decline", "easing", "peace", "support"];
const cacheKey = "gdeltNewsCache";
const lockKey = "gdeltFetchLock";
const cacheTtlMs = 24 * 60 * 60 * 1000;
const retryAfterMs = 30 * 60 * 1000;
const lockTtlMs = 2 * 60 * 1000;
const broadQuery = '(Taiwan OR "North Korea" OR DPRK OR USINDOPACOM OR "Indo-Pacific" OR Okinawa OR Kadena OR Futenma OR Henoko OR "U.S. Forces Japan" OR USFJ OR "Joint Force Headquarters" OR "Marine Littoral Regiment" OR "12th MLR" OR "first island chain" OR "Pacific Deterrence Initiative" OR "Federal Reserve" OR FOMC OR "U.S. economy" OR inflation OR "gas prices" OR "government shutdown" OR "defense budget" OR oil OR shipping OR childcare OR "restaurant prices" OR Walmart OR Target OR Costco OR Starbucks OR McDonald\'s)';

const topicKeywords: Record<string, string[]> = {
  taiwan: ["taiwan", "taiwan strait", "china", "pla", "blockade", "invasion", "warship"],
  northkorea: ["north korea", "dprk", "missile", "nuclear", "sanctions"],
  indopacific: ["usindopacom", "indo-pacific", "pentagon", "deployment", "exercise", "taiwan", "japan"],
  okinawa_usfj: ["usfj", "u.s. forces japan", "kadena", "okinawa", "futenma", "camp foster", "marines", "air force"],
  henoko: ["henoko", "futenma", "okinawa", "relocation", "protest", "landfill"],
  us_economy: ["u.s. economy", "inflation", "gas prices", "layoffs", "consumer sentiment", "job market"],
  us_politics_market: ["federal reserve", "congress", "defense budget", "tariffs", "sanctions", "government shutdown", "stock market"],
  fed_policy: ["federal reserve", "fomc", "powell", "interest rates", "rate cut", "rate hike", "yields"],
  treasury_fiscal: ["u.s. treasury", "federal debt", "government shutdown", "debt ceiling", "treasury yields", "deficit"],
  global_energy_shipping: ["oil", "gasoline", "shipping", "red sea", "houthi", "freight", "supply chain"],
  us_service_prices: ["restaurant prices", "childcare", "babysitting", "rent", "healthcare", "service prices"],
  corporate_pricing: ["walmart", "target", "costco", "mcdonald", "starbucks", "retail sales", "consumer spending"],
  defense_budget_pacific: ["defense budget", "pentagon", "pacific deterrence", "indo-pacific command", "okinawa", "guam", "taiwan"],
  okinawa_operations: ["okinawa", "kadena", "futenma", "camp foster", "camp hansen", "u.s. military", "marines", "exercise", "incident", "training"],
  us_japan_command: ["u.s. forces japan", "usfj", "joint force headquarters", "japan self-defense forces", "jsdf", "command", "integration", "interoperability", "alliance", "headquarters"],
  first_island_chain: ["marine littoral regiment", "12th mlr", "first island chain", "stand-in force", "camp hansen", "camp schwab", "okinawa", "taiwan", "exercise"]
};

const hits = (text: string, words: string[]) => words.reduce((sum, word) => sum + (text.toLowerCase().match(new RegExp(`\\b${word}\\b`, "g"))?.length ?? 0), 0);

class StopRetryError extends Error {}

function clientId() {
  const key = "gdeltClientId";
  const existing = sessionStorage.getItem(key);
  if (existing) return existing;
  const value = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  sessionStorage.setItem(key, value);
  return value;
}

function acquireGdeltLock() {
  const owner = clientId();
  const now = Date.now();
  try {
    const raw = localStorage.getItem(lockKey);
    const lock = raw ? (JSON.parse(raw) as { owner: string; expiresAt: number }) : null;
    if (lock && lock.expiresAt > now && lock.owner !== owner) return false;
    localStorage.setItem(lockKey, JSON.stringify({ owner, expiresAt: now + lockTtlMs }));
    return true;
  } catch {
    return true;
  }
}

function releaseGdeltLock() {
  const owner = clientId();
  try {
    const raw = localStorage.getItem(lockKey);
    const lock = raw ? (JSON.parse(raw) as { owner: string; expiresAt: number }) : null;
    if (lock?.owner === owner) localStorage.removeItem(lockKey);
  } catch {
    // Ignore lock cleanup failures.
  }
}

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

const isEnvelope = (value: unknown): value is GdeltCacheEnvelope => {
  return typeof value === "object" && value !== null && Array.isArray((value as GdeltCacheEnvelope).data);
};

function getCacheEnvelope(timespan?: string) {
  try {
    const raw = localStorage.getItem(cacheKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as TopicScore[] | GdeltCacheEnvelope;
    if (!isEnvelope(parsed) || parsed.version !== 4) return null;
    if (timespan && parsed.timespan !== timespan) return null;
    return parsed;
  } catch {
    return null;
  }
}

export const getGdeltCache = (timespan?: string) => {
  try {
    const raw = localStorage.getItem(cacheKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as TopicScore[] | GdeltCacheEnvelope;
    const data = Array.isArray(parsed) ? parsed : parsed.data;
    const date = isEnvelope(parsed) ? parsed.date : localStorage.getItem("lastUpdated");
    const cacheTimespan = isEnvelope(parsed) ? parsed.timespan : undefined;
    if (timespan && cacheTimespan && cacheTimespan !== timespan) return null;
    if (date && Date.now() - new Date(date).getTime() > cacheTtlMs) {
      return data.map((item) => ({ ...item, status: "cache" as const }));
    }
    return data.map((item) => ({ ...item, status: item.status === "fallback" ? item.status : "cache" as const }));
  } catch {
    return null;
  }
};

export function getGdeltCacheMeta(timespan?: string) {
  const envelope = getCacheEnvelope(timespan);
  if (!envelope) return null;
  return {
    date: envelope.date,
    attemptedAt: envelope.attemptedAt,
    retryAfterMs: envelope.retryAfterMs,
    retryUntil: new Date(new Date(envelope.attemptedAt).getTime() + envelope.retryAfterMs).toISOString()
  };
}

export function gdeltCacheNeedsRefresh(timespan: string) {
  try {
    const envelope = getCacheEnvelope(timespan);
    if (!envelope) return true;
    const hasNonLive = envelope.data.some((topic) => topic.status !== "live");
    const attemptedRecently = Date.now() - new Date(envelope.attemptedAt).getTime() < envelope.retryAfterMs;
    if (hasNonLive && attemptedRecently) return false;
    if (Date.now() - new Date(envelope.date).getTime() > cacheTtlMs) return true;
    return hasNonLive;
  } catch {
    return true;
  }
}

function gdeltUrls(query: string, timespan: string, maxrecords = 50) {
  const params = new URLSearchParams({ query, timespan, maxrecords: String(maxrecords) });
  const direct = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(query)}&mode=artlist&format=json&maxrecords=${maxrecords}&sort=datedesc&timespan=${timespan}&sourcelang=english`;
  const proxy = `/api/gdelt?${params.toString()}`;
  return [proxy, direct];
}

async function fetchArticles(query: string, timespan: string, maxrecords = 50) {
  let lastError = "unknown";
  for (const url of gdeltUrls(query, timespan, maxrecords)) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const contentType = res.headers.get("content-type") ?? "";
      if (!contentType.includes("json")) {
        const text = await res.text();
        if (text.toLowerCase().includes("please limit requests")) throw new StopRetryError("GDELT rate limit: wait before refreshing");
        throw new Error("GDELT returned non-JSON response");
      }
      const json = (await res.json()) as { articles?: NewsArticle[] };
      return json.articles ?? [];
    } catch (error) {
      lastError = error instanceof Error ? error.message : "unknown";
      if (error instanceof StopRetryError) break;
    }
  }
  throw new Error(lastError);
}

function articleBody(article: NewsArticle) {
  return `${article.title ?? ""} ${article.domain ?? ""} ${article.url ?? ""}`.toLowerCase();
}

function articlesForTopic(topic: NewsTopic, articles: NewsArticle[]) {
  const keywords = topicKeywords[topic.id] ?? [];
  if (!keywords.length) return articles.slice(0, 12);
  return articles.filter((article) => {
    const body = articleBody(article);
    return keywords.some((keyword) => body.includes(keyword));
  }).slice(0, 12);
}

async function fetchBulkTopics(timespan: string): Promise<TopicScore[]> {
  const articles = await fetchArticles(broadQuery, timespan, 150);
  return newsTopics.map((topic) => {
    const topicArticles = articlesForTopic(topic, articles);
    const scored = scoreTopic(topic, topicArticles);
    return {
      id: topic.id,
      label: topic.label,
      query: topic.query,
      scoreRole: topic.scoreRole,
      articleCount: topicArticles.length,
      ...scored,
      status: "live" as const,
      articles: topicArticles
    };
  });
}

export async function fetchGdelt(timespan: string): Promise<{ data: TopicScore[]; logs: string[] }> {
  const logs: string[] = [];
  const cached = getGdeltCache(timespan);
  const fallback = fallbackGdelt();
  const envelope = getCacheEnvelope(timespan);
  const recentNonLiveAttempt = envelope && envelope.data.some((topic) => topic.status !== "live") && Date.now() - new Date(envelope.attemptedAt).getTime() < envelope.retryAfterMs;

  if (recentNonLiveAttempt) {
    logs.push("GDELT cooldown active: using cache/fallback to avoid another 429.");
    logs.push("Wait about 30 minutes after a rate-limit event before refreshing again.");
    return { data: cached ?? fallback, logs };
  }

  if (!acquireGdeltLock()) {
    logs.push("GDELT update skipped: another dashboard tab is already refreshing.");
    logs.push("Using the current local cache in this tab.");
    return { data: cached ?? fallback, logs };
  }

  let results: TopicScore[];
  try {
    results = await fetchBulkTopics(timespan);
    logs.push(`GDELT broad fetch OK: ${results.reduce((sum, topic) => sum + topic.articleCount, 0)} articles classified into ${results.length} topics.`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    logs.push(`GDELT broad fetch failed: ${message}`);
    logs.push("GDELT is rate-limited easily. Auto retry is paused for 30 minutes after failure.");
    results = newsTopics.map((topic) => {
      const cachedTopic = cached?.find((c) => c.id === topic.id);
      if (cachedTopic) return { ...cachedTopic, status: "cache" as const };
      return fallback.find((f) => f.id === topic.id)!;
    });
  } finally {
    releaseGdeltLock();
  }

  localStorage.setItem(cacheKey, JSON.stringify({ version: 4, date: new Date().toISOString(), timespan, attemptedAt: new Date().toISOString(), retryAfterMs, data: results } satisfies GdeltCacheEnvelope));
  localStorage.setItem("lastUpdated", new Date().toISOString());
  logs.push(`GDELT update complete: live ${results.filter((r) => r.status === "live").length}/${results.length} topics.`);
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
