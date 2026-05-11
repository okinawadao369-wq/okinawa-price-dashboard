const allowedTimespans = new Set(["1d", "2d", "3d", "7d"]);

export const config = {
  maxDuration: 30
};

export default async function handler(req: any, res: any) {
  const query = String(req.query?.query ?? "").trim();
  const timespan = String(req.query?.timespan ?? "1d");

  const maxrecords = String(req.query?.maxrecords ?? "50");

  if (!query || query.length > 1200) {
    res.status(400).json({ error: "Invalid GDELT query" });
    return;
  }

  if (!allowedTimespans.has(timespan)) {
    res.status(400).json({ error: "Unsupported GDELT timespan" });
    return;
  }

  const url = new URL("https://api.gdeltproject.org/api/v2/doc/doc");
  url.searchParams.set("query", query);
  url.searchParams.set("mode", "artlist");
  url.searchParams.set("format", "json");
  url.searchParams.set("maxrecords", /^(10|25|50|100|150|250)$/.test(maxrecords) ? maxrecords : "50");
  url.searchParams.set("sort", "datedesc");
  url.searchParams.set("timespan", timespan);
  url.searchParams.set("sourcelang", "english");

  try {
    const upstream = await fetch(url, { headers: { "user-agent": "okinawa-price-dashboard/1.0" } });
    const body = await upstream.text();
    if (body.toLowerCase().includes("please limit requests")) {
      res.status(429).json({ error: "GDELT rate limit: please wait before refreshing again" });
      return;
    }
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.setHeader("cache-control", "s-maxage=900, stale-while-revalidate=3600");
    res.status(upstream.status).send(body);
  } catch (error) {
    res.status(502).json({ error: error instanceof Error ? error.message : "GDELT proxy failed" });
  }
}
