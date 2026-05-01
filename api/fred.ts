const allowedSeries = new Set([
  "DEXJPUS",
  "CPIAUCSL",
  "CPILFESL",
  "CUSR0000SEFV",
  "APU000074714",
  "APU0000708111",
  "UNRATE",
  "CES0500000003",
  "FEDFUNDS",
  "DGS10",
  "UMCSENT"
]);

export default async function handler(req: any, res: any) {
  const seriesId = String(req.query?.series_id ?? "");
  if (!allowedSeries.has(seriesId)) {
    res.status(400).json({ error: "Unsupported FRED series_id" });
    return;
  }

  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "FRED_API_KEY is not configured on the server" });
    return;
  }

  const url = new URL("https://api.stlouisfed.org/fred/series/observations");
  url.searchParams.set("series_id", seriesId);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("file_type", "json");
  url.searchParams.set("sort_order", "desc");
  url.searchParams.set("limit", "420");

  try {
    const upstream = await fetch(url);
    const body = await upstream.text();
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.setHeader("cache-control", "s-maxage=3600, stale-while-revalidate=86400");
    res.status(upstream.status).send(body);
  } catch (error) {
    res.status(502).json({ error: error instanceof Error ? error.message : "FRED proxy failed" });
  }
}
