type FxPayload = {
  pair: "USD/JPY";
  value: number;
  unit: "JPY/USD";
  source: string;
  quality: "observed";
  observedAt: string;
  fetchedAt: string;
};

const providers = [
  {
    name: "ExchangeRate-API open endpoint",
    url: "https://open.er-api.com/v6/latest/USD",
    parse: (payload: any) => ({
      value: Number(payload?.rates?.JPY),
      observedAt: String(payload?.time_last_update_utc ?? new Date().toISOString())
    })
  },
  {
    name: "Frankfurter ECB reference",
    url: "https://api.frankfurter.app/latest?from=USD&to=JPY",
    parse: (payload: any) => ({
      value: Number(payload?.rates?.JPY),
      observedAt: String(payload?.date ?? new Date().toISOString())
    })
  }
];

export default async function handler(_req: any, res: any) {
  const errors: string[] = [];

  for (const provider of providers) {
    try {
      const response = await fetch(provider.url, { headers: { accept: "application/json" } });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      const parsed = provider.parse(await response.json());
      if (!Number.isFinite(parsed.value) || parsed.value <= 0) throw new Error("JPY rate missing");

      const body: FxPayload = {
        pair: "USD/JPY",
        value: parsed.value,
        unit: "JPY/USD",
        source: provider.name,
        quality: "observed",
        observedAt: parsed.observedAt,
        fetchedAt: new Date().toISOString()
      };

      res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=1800");
      return res.status(200).json(body);
    } catch (error) {
      errors.push(`${provider.name}: ${error instanceof Error ? error.message : "unknown"}`);
    }
  }

  return res.status(502).json({
    error: "USD/JPY exchange-rate providers failed",
    errors,
    fetchedAt: new Date().toISOString()
  });
}
