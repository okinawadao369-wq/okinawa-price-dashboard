const blsSeriesByFredId: Record<string, string> = {
  CPIAUCSL: "CUSR0000SA0",
  CPILFESL: "CUSR0000SA0L1E",
  CUSR0000SEFV: "CUSR0000SEFV",
  APU000074714: "APU000074714",
  APU0000708111: "APU0000708111",
  UNRATE: "LNS14000000",
  CES0500000003: "CES0500000003"
};

type BlsDataPoint = {
  year: string;
  period: string;
  value: string;
};

function periodToDate(point: BlsDataPoint) {
  const month = Number(point.period.replace("M", ""));
  if (!Number.isInteger(month) || month < 1 || month > 12) return null;
  return `${point.year}-${String(month).padStart(2, "0")}-01`;
}

export default async function handler(req: any, res: any) {
  const fredSeriesId = String(req.query?.series_id ?? "");
  const blsSeriesId = blsSeriesByFredId[fredSeriesId];

  if (!blsSeriesId) {
    res.status(400).json({ error: "Unsupported BLS fallback series_id" });
    return;
  }

  const endYear = new Date().getUTCFullYear();
  const startYear = endYear - 4;

  try {
    const upstream = await fetch("https://api.bls.gov/publicAPI/v2/timeseries/data/", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        seriesid: [blsSeriesId],
        startyear: String(startYear),
        endyear: String(endYear)
      })
    });

    if (!upstream.ok) {
      res.status(upstream.status).json({ error: `BLS upstream ${upstream.status}` });
      return;
    }

    const json = await upstream.json();
    const series = json?.Results?.series?.[0];
    const observations = ((series?.data ?? []) as BlsDataPoint[])
      .map((point) => ({ date: periodToDate(point), value: point.value }))
      .filter((point) => point.date && point.value !== "." && Number.isFinite(Number(point.value)))
      .sort((a, b) => String(b.date).localeCompare(String(a.date)));

    if (!observations.length) {
      res.status(502).json({ error: "BLS returned no numeric observations" });
      return;
    }

    res.setHeader("content-type", "application/json; charset=utf-8");
    res.setHeader("cache-control", "s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).json({
      observations,
      source: "BLS",
      sourceSeriesId: blsSeriesId,
      quality: "observed"
    });
  } catch (error) {
    res.status(502).json({ error: error instanceof Error ? error.message : "BLS proxy failed" });
  }
}
