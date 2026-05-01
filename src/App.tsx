import { useCallback, useEffect, useMemo, useState } from "react";
import { AreaMarketMap } from "./components/AreaMarketMap";
import { FredDataPanel } from "./components/FredDataPanel";
import { GeoNewsPanel } from "./components/GeoNewsPanel";
import { Header } from "./components/Header";
import { IndustryTable } from "./components/IndustryTable";
import { KpiCards } from "./components/KpiCards";
import { PricingSimulator } from "./components/PricingSimulator";
import { SegmentCards } from "./components/SegmentCards";
import { SourcesPanel } from "./components/SourcesPanel";
import { UpdateControls } from "./components/UpdateControls";
import { AiConsultantPanel } from "./components/AiConsultantPanel";
import { DailyMemoPanel, NewsArticlePanel } from "./components/DailyMemoPanel";
import { TradingViewFxPanel } from "./components/TradingViewFxPanel";
import { areas, industries, segments } from "./data/baseData";
import { fallbackFred, fetchFred, fredValue, fredYoY, getFredCache, type FredPoint } from "./utils/fredClient";
import { aggregateNews, fallbackGdelt, fetchGdelt, getGdeltCache, type TopicScore } from "./utils/gdeltClient";
import { calculatePurchaseScore, computeMarketTemperature, recommendedRange } from "./utils/pricingEngine";

const envFredKey = import.meta.env.VITE_FRED_API_KEY as string | undefined;

function stored(key: string, fallback: string) {
  return localStorage.getItem(key) ?? fallback;
}

export default function App() {
  const [fredData, setFredData] = useState<FredPoint[]>(() => getFredCache() ?? fallbackFred());
  const [newsScores, setNewsScores] = useState<TopicScore[]>(() => getGdeltCache() ?? fallbackGdelt());
  const [selectedIndustryId, setSelectedIndustryId] = useState(() => stored("selectedIndustry", "ft_4d"));
  const [selectedSegmentId, setSelectedSegmentId] = useState(() => stored("selectedSegment", "E4E6"));
  const [selectedAreaName, setSelectedAreaName] = useState(() => stored("selectedArea", areas[0].area));
  const [selectedFx, setSelectedFx] = useState(() => Number(stored("selectedFx", "156")));
  const [selectedTimespan, setSelectedTimespan] = useState(() => stored("selectedTimespan", "1d"));
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [fredInlineKey, setFredInlineKey] = useState("");

  const selectedIndustry = industries.find((i) => i.id === selectedIndustryId) ?? industries[1];
  const selectedSegment = segments.find((s) => s.id === selectedSegmentId) ?? segments[1];
  const selectedArea = areas.find((a) => a.area === selectedAreaName) ?? areas[0];
  const [price, setPrice] = useState(selectedIndustry.okinawaCurrent);

  const newsAgg = useMemo(() => aggregateNews(newsScores), [newsScores]);
  const cpiYoY = fredYoY(fredData, "CPIAUCSL", 3.1);
  const fx = selectedFx || fredValue(fredData, "DEXJPUS", 156);
  const marketTemperature = computeMarketTemperature({
    fx,
    cpiYoY,
    unemployment: fredValue(fredData, "UNRATE", 4.1),
    averageHourlyEarnings: fredValue(fredData, "CES0500000003", 35.5),
    consumerSentiment: fredValue(fredData, "UMCSENT", 61.8),
    geoRisk: newsAgg.geoRisk,
    forwardPosture: newsAgg.forwardPosture,
    okinawaBase: newsAgg.okinawaBase
  });
  const range = recommendedRange(selectedIndustry, fx, cpiYoY, newsAgg.geoRisk);
  const score = calculatePurchaseScore({ item: selectedIndustry, segment: selectedSegment, area: selectedArea, priceJPY: price, fx, marketTemperature });

  const refreshAll = useCallback(async () => {
    setLoading(true);
    const stamp = new Date().toLocaleString("ja-JP");
    setLogs((old) => [`${stamp} 更新開始`, ...old].slice(0, 20));
    const [fred, gdelt] = await Promise.all([fetchFred(envFredKey, fredInlineKey), fetchGdelt(selectedTimespan)]);
    setFredData(fred.data);
    setNewsScores(gdelt.data);
    setLogs((old) => [`${stamp} 更新完了`, ...fred.logs, ...gdelt.logs, ...old].slice(0, 30));
    setLoading(false);
  }, [fredInlineKey, selectedTimespan]);

  useEffect(() => {
    localStorage.setItem("selectedIndustry", selectedIndustryId);
    localStorage.setItem("selectedSegment", selectedSegmentId);
    localStorage.setItem("selectedArea", selectedAreaName);
    localStorage.setItem("selectedFx", String(selectedFx));
    localStorage.setItem("selectedTimespan", selectedTimespan);
  }, [selectedIndustryId, selectedSegmentId, selectedAreaName, selectedFx, selectedTimespan]);

  useEffect(() => {
    setPrice((industries.find((i) => i.id === selectedIndustryId) ?? industries[1]).okinawaCurrent);
  }, [selectedIndustryId]);

  useEffect(() => {
    const last = localStorage.getItem("lastUpdated");
    const stale = !last || Date.now() - new Date(last).getTime() > 24 * 60 * 60 * 1000;
    if (autoUpdate && stale) void refreshAll();
  }, [autoUpdate, refreshAll]);

  return (
    <div className="app-shell">
      <Header />
      <main className="dashboard-main">
        <KpiCards fx={fx} cpiYoY={cpiYoY} geoRisk={newsAgg.geoRisk} marketTemperature={marketTemperature} />
        <div className="grid-2">
          <AiConsultantPanel item={selectedIndustry} segment={selectedSegment} area={selectedArea} priceJPY={price} fx={fx} range={range} score={score} geoRisk={newsAgg.geoRisk} marketTemperature={marketTemperature} />
          <UpdateControls autoUpdate={autoUpdate} setAutoUpdate={setAutoUpdate} timespan={selectedTimespan} setTimespan={setSelectedTimespan} onRefresh={refreshAll} loading={loading} logs={logs} fredInlineKey={fredInlineKey} setFredInlineKey={setFredInlineKey} />
        </div>
        <TradingViewFxPanel />
        <PricingSimulator industries={industries} segments={segments} areas={areas} selectedIndustry={selectedIndustry} selectedSegment={selectedSegment} selectedArea={selectedArea} price={price} fx={fx} cpiYoY={cpiYoY} geoRisk={newsAgg.geoRisk} marketTemperature={marketTemperature} setIndustry={setSelectedIndustryId} setSegment={setSelectedSegmentId} setArea={setSelectedAreaName} setPrice={setPrice} setFx={setSelectedFx} />
        <div className="grid-2">
          <GeoNewsPanel scores={newsScores} />
          <DailyMemoPanel fredData={fredData} newsScores={newsScores} marketTemperature={marketTemperature} />
        </div>
        <div className="grid-2">
          <FredDataPanel data={fredData} />
          <NewsArticlePanel scores={newsScores} />
        </div>
        <AreaMarketMap areas={areas} />
        <SegmentCards segments={segments} />
        <IndustryTable industries={industries} segment={selectedSegment} area={selectedArea} fx={fx} cpiYoY={cpiYoY} geoRisk={newsAgg.geoRisk} marketTemperature={marketTemperature} />
        <SourcesPanel />
      </main>
    </div>
  );
}
