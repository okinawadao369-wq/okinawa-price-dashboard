import { fredSeries } from "../data/baseData";
import { apiUrl } from "./apiBase";

export type FredPoint = {
  id: string;
  label: string;
  value: number;
  date: string;
  yoy?: number;
  status: "live" | "fallback" | "cache";
  source?: "FRED" | "BLS" | "cache" | "fallback";
  meaning: string;
  unit: string;
};

type FredObservation = { date: string; value: string };
type FredLikeResponse = { observations: FredObservation[]; source?: "FRED" | "BLS" };

const cacheKey = "fredCache";
const cacheUpdatedAtKey = "fredCacheUpdatedAt";

export function fallbackFred(): FredPoint[] {
  return fredSeries.map((s) => ({
    id: s.id,
    label: s.label,
    value: s.fallback,
    date: "fallback",
    yoy: s.yoy ? 3.1 : undefined,
    status: "fallback",
    source: "fallback",
    meaning: s.meaning,
    unit: s.unit
  }));
}

export const getFredCache = () => {
  try {
    const raw = localStorage.getItem(cacheKey);
    const data = raw ? (JSON.parse(raw) as FredPoint[]) : null;
    return data ? data.map((point) => ({ ...point, status: point.status === "fallback" ? "fallback" as const : "cache" as const })) : null;
  } catch {
    return null;
  }
};

export const getFredCacheUpdatedAt = () => localStorage.getItem(cacheUpdatedAtKey);

async function fetchFredLike(url: string): Promise<FredLikeResponse> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as FredLikeResponse;
}

export async function fetchFred(apiKey?: string, inlineKey?: string): Promise<{ data: FredPoint[]; logs: string[] }> {
  const key = (apiKey || inlineKey || "").trim();
  const logs: string[] = [];
  const cached = getFredCache();

  const results = await Promise.all(
    fredSeries.map(async (series) => {
      const fredUrl = key
        ? `https://api.stlouisfed.org/fred/series/observations?series_id=${series.id}&api_key=${encodeURIComponent(key)}&file_type=json&sort_order=desc&limit=420`
        : apiUrl(`/api/fred?series_id=${encodeURIComponent(series.id)}`);

      try {
        let json: FredLikeResponse;
        try {
          json = await fetchFredLike(fredUrl);
        } catch (fredError) {
          if (key) throw fredError;
          const blsUrl = apiUrl(`/api/bls?series_id=${encodeURIComponent(series.id)}`);
          json = await fetchFredLike(blsUrl);
          const message = fredError instanceof Error ? fredError.message : "unknown";
          logs.push(`${series.id} FRED取得失敗: ${message}。BLS公式APIで補完。`);
        }

        const observations = json.observations.filter((o) => o.value !== "." && Number.isFinite(Number(o.value)));
        const latest = observations[0];
        if (!latest) throw new Error("no numeric observations");

        let yoy: number | undefined;
        if (series.yoy) {
          const latestDate = new Date(latest.date);
          const prior = observations.find((o) => {
            const d = new Date(o.date);
            const days = Math.abs((latestDate.getTime() - d.getTime()) / 86400000 - 365);
            return days < 45;
          });
          if (prior) yoy = ((Number(latest.value) - Number(prior.value)) / Number(prior.value)) * 100;
        }

        return {
          id: series.id,
          label: series.label,
          value: Number(latest.value),
          date: latest.date,
          yoy,
          status: "live" as const,
          source: json.source ?? "FRED",
          meaning: series.meaning,
          unit: series.unit
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : "unknown";
        const cachedPoint = cached?.find((point) => point.id === series.id);
        if (cachedPoint) {
          logs.push(`${series.id} FRED取得失敗: ${message}。前回キャッシュを使用。`);
          return { ...cachedPoint, status: "cache" as const, source: "cache" as const };
        }

        logs.push(`${series.id} FRED取得失敗: ${message}。fallback値を使用。`);
        return {
          id: series.id,
          label: series.label,
          value: series.fallback,
          date: "fallback",
          yoy: series.yoy ? 3.1 : undefined,
          status: "fallback" as const,
          source: "fallback" as const,
          meaning: series.meaning,
          unit: series.unit
        };
      }
    })
  );

  localStorage.setItem(cacheKey, JSON.stringify(results));
  localStorage.setItem(cacheUpdatedAtKey, new Date().toISOString());
  localStorage.setItem("lastUpdated", new Date().toISOString());
  logs.push(`FRED更新完了: ライブ ${results.filter((r) => r.status === "live").length}/${results.length} 系列`);
  return { data: results, logs };
}

export const fredValue = (data: FredPoint[], id: string, fallback = 0) => data.find((d) => d.id === id)?.value ?? fallback;
export const fredYoY = (data: FredPoint[], id: string, fallback = 3) => data.find((d) => d.id === id)?.yoy ?? fallback;
