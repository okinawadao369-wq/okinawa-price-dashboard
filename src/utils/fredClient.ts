import { fredSeries } from "../data/baseData";

export type FredPoint = {
  id: string;
  label: string;
  value: number;
  date: string;
  yoy?: number;
  status: "live" | "fallback" | "cache";
  meaning: string;
  unit: string;
};

type FredObservation = { date: string; value: string };

const cacheKey = "fredCache";

export function fallbackFred(): FredPoint[] {
  return fredSeries.map((s) => ({
    id: s.id,
    label: s.label,
    value: s.fallback,
    date: "fallback",
    yoy: s.yoy ? 3.1 : undefined,
    status: "fallback",
    meaning: s.meaning,
    unit: s.unit
  }));
}

export const getFredCache = () => {
  try {
    const raw = localStorage.getItem(cacheKey);
    return raw ? (JSON.parse(raw) as FredPoint[]) : null;
  } catch {
    return null;
  }
};

export async function fetchFred(apiKey?: string, inlineKey?: string): Promise<{ data: FredPoint[]; logs: string[] }> {
  const key = (apiKey || inlineKey || "").trim();
  const logs: string[] = [];
  const results = await Promise.all(
    fredSeries.map(async (series) => {
      const url = key
        ? `https://api.stlouisfed.org/fred/series/observations?series_id=${series.id}&api_key=${encodeURIComponent(key)}&file_type=json&sort_order=desc&limit=420`
        : `/api/fred?series_id=${encodeURIComponent(series.id)}`;
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const json = (await res.json()) as { observations: FredObservation[] };
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
        return { id: series.id, label: series.label, value: Number(latest.value), date: latest.date, yoy, status: "live" as const, meaning: series.meaning, unit: series.unit };
      } catch (error) {
        logs.push(`${series.id}取得失敗: ${error instanceof Error ? error.message : "unknown"}。fallback値を使用。`);
        return { id: series.id, label: series.label, value: series.fallback, date: "fallback", yoy: series.yoy ? 3.1 : undefined, status: "fallback" as const, meaning: series.meaning, unit: series.unit };
      }
    })
  );
  localStorage.setItem(cacheKey, JSON.stringify(results));
  localStorage.setItem("lastUpdated", new Date().toISOString());
  logs.push(`FRED更新完了: ${results.filter((r) => r.status === "live").length}/${results.length}系列`);
  return { data: results, logs };
}

export const fredValue = (data: FredPoint[], id: string, fallback = 0) => data.find((d) => d.id === id)?.value ?? fallback;
export const fredYoY = (data: FredPoint[], id: string, fallback = 3) => data.find((d) => d.id === id)?.yoy ?? fallback;
