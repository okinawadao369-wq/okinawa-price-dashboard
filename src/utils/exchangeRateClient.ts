export type ExchangeRatePoint = {
  pair: "USD/JPY";
  value: number;
  unit: "JPY/USD";
  source: string;
  quality: "observed" | "fallback";
  observedAt: string;
  fetchedAt: string;
};

type Provider = {
  name: string;
  url: string;
  parse: (payload: any) => { value: number; observedAt: string };
};

const cacheKey = "liveUsdJpyRate";
const fallbackRate = 157.8178;

export function getExchangeRateCache() {
  try {
    const raw = localStorage.getItem(cacheKey);
    return raw ? (JSON.parse(raw) as ExchangeRatePoint) : null;
  } catch {
    return null;
  }
}

export function fallbackExchangeRate(): ExchangeRatePoint {
  return {
    pair: "USD/JPY",
    value: fallbackRate,
    unit: "JPY/USD",
    source: "fallback from 2026-05-14 ExchangeRate-API check",
    quality: "fallback",
    observedAt: "Thu, 14 May 2026 00:02:31 +0000",
    fetchedAt: new Date().toISOString()
  };
}

function normalizePoint(payload: any, sourceName: string): ExchangeRatePoint {
  const value = Number(payload?.value);
  if (!Number.isFinite(value) || value <= 0) throw new Error("JPY rate missing");
  return {
    pair: "USD/JPY",
    value,
    unit: "JPY/USD",
    source: String(payload?.source ?? sourceName),
    quality: "observed",
    observedAt: String(payload?.observedAt ?? new Date().toISOString()),
    fetchedAt: String(payload?.fetchedAt ?? new Date().toISOString())
  };
}

export async function fetchExchangeRate(): Promise<{ data: ExchangeRatePoint; logs: string[] }> {
  const logs: string[] = [];
  const providers: Provider[] = [
    {
      name: "Vercel exchange-rate proxy",
      url: "/api/exchange-rate",
      parse: (payload: any) => {
        const point = normalizePoint(payload, "Vercel exchange-rate proxy");
        return { value: point.value, observedAt: point.observedAt };
      }
    },
    {
      name: "ExchangeRate-API direct",
      url: "https://open.er-api.com/v6/latest/USD",
      parse: (payload: any) => ({
        value: Number(payload?.rates?.JPY),
        observedAt: String(payload?.time_last_update_utc ?? new Date().toISOString())
      })
    },
    {
      name: "Frankfurter direct",
      url: "https://api.frankfurter.app/latest?from=USD&to=JPY",
      parse: (payload: any) => ({
        value: Number(payload?.rates?.JPY),
        observedAt: String(payload?.date ?? new Date().toISOString())
      })
    }
  ];

  for (const provider of providers) {
    try {
      const res = await fetch(provider.url);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const payload = await res.json();
      const parsed = provider.parse(payload);
      if (!Number.isFinite(parsed.value) || parsed.value <= 0) throw new Error("JPY rate missing");

      const data: ExchangeRatePoint = provider.name === "Vercel exchange-rate proxy"
        ? normalizePoint(payload, provider.name)
        : {
            pair: "USD/JPY",
            value: parsed.value,
            unit: "JPY/USD",
            source: provider.name,
            quality: "observed",
            observedAt: parsed.observedAt,
            fetchedAt: new Date().toISOString()
          };

      localStorage.setItem(cacheKey, JSON.stringify(data));
      logs.push(`USD/JPY更新完了: ${data.value.toFixed(4)} (${data.source})`);
      return { data, logs };
    } catch (error) {
      logs.push(`${provider.name} 為替取得失敗: ${error instanceof Error ? error.message : "unknown"}`);
    }
  }

  const cached = getExchangeRateCache();
  if (cached) {
    logs.push(`USD/JPYは前回キャッシュを使用: ${cached.value.toFixed(4)} (${cached.source})`);
    return { data: { ...cached, quality: "fallback" }, logs };
  }

  const fallback = fallbackExchangeRate();
  logs.push(`USD/JPYはfallback値を使用: ${fallback.value.toFixed(4)}`);
  return { data: fallback, logs };
}
