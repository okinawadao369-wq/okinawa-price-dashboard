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
import { StrategicIntelligencePanel } from "./components/StrategicIntelligencePanel";
import { MarketDataOpsPanel } from "./components/MarketDataOpsPanel";
import { LiveFxPanel } from "./components/LiveFxPanel";
import { BrowserResearchPanel } from "./components/BrowserResearchPanel";
import { GdeltImpactPanel } from "./components/GdeltImpactPanel";
import { UsPriceAnchorPanel } from "./components/UsPriceAnchorPanel";
import { areas, industries, segments } from "./data/baseData";
import { fallbackFred, fetchFred, fredValue, fredYoY, getFredCache, type FredPoint } from "./utils/fredClient";
import { aggregateNews, fallbackGdelt, fetchGdelt, gdeltCacheNeedsRefresh, getGdeltCache, getGdeltCacheMeta, type TopicScore } from "./utils/gdeltClient";
import { calculatePurchaseScore, computeMarketTemperature, recommendedRange } from "./utils/pricingEngine";
import { computeStrategicIntelligence } from "./utils/strategicEngine";
import { computeMarketDataOps } from "./utils/marketIntelligenceEngine";
import { fallbackExchangeRate, fetchExchangeRate, getExchangeRateCache, type ExchangeRatePoint } from "./utils/exchangeRateClient";
import { fallbackRssIntel, fetchRssIntel, getRssIntelCache, type RssIntelResult } from "./utils/rssIntelClient";
import { adjustIndustryUsAnchors } from "./utils/usPriceAnchorEngine";

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
  const [liveFxRate, setLiveFxRate] = useState<ExchangeRatePoint>(() => getExchangeRateCache() ?? fallbackExchangeRate());
  const [rssIntel, setRssIntel] = useState<RssIntelResult>(() => getRssIntelCache() ?? fallbackRssIntel());
  const [manualFxOverride, setManualFxOverride] = useState(false);

  const newsScoresForPricing = useMemo(() => {
    const gdeltLiveRatio = newsScores.filter((topic) => topic.status === "live").length / Math.max(newsScores.length, 1);
    if (!rssIntel.liveCount || gdeltLiveRatio >= 0.5) return newsScores;
    return newsScores.map((topic) => {
      if (!["consumerStress", "marketRisk", "forwardPosture", "okinawaBase"].includes(topic.scoreRole)) return topic;
      return {
        ...topic,
        score: Math.round(topic.score * 0.65 + rssIntel.riskScore * 0.35)
      };
    });
  }, [newsScores, rssIntel]);
  const pricedIndustries = useMemo(() => adjustIndustryUsAnchors(industries, fredData, newsScoresForPricing), [fredData, newsScoresForPricing]);
  const selectedIndustry = pricedIndustries.find((i) => i.id === selectedIndustryId) ?? pricedIndustries[1];
  const selectedSegment = segments.find((s) => s.id === selectedSegmentId) ?? segments[1];
  const selectedArea = areas.find((a) => a.area === selectedAreaName) ?? areas[0];
  const [price, setPrice] = useState(selectedIndustry.okinawaCurrent);

  const gdeltAgg = useMemo(() => aggregateNews(newsScores), [newsScores]);
  const newsAgg = useMemo(() => {
    const gdeltLiveRatio = newsScores.filter((topic) => topic.status === "live").length / Math.max(newsScores.length, 1);
    const rssReady = rssIntel.liveCount > 0 && rssIntel.total > 0;
    const rssWeight = rssReady ? (gdeltLiveRatio < 0.5 ? 0.35 : 0.15) : 0;
    const blend = (gdeltValue: number, rssValue: number) => Math.round(gdeltValue * (1 - rssWeight) + rssValue * rssWeight);
    if (!rssWeight) return gdeltAgg;

    return {
      ...gdeltAgg,
      geoRisk: blend(gdeltAgg.geoRisk, rssIntel.riskScore),
      forwardPosture: blend(gdeltAgg.forwardPosture, rssIntel.riskScore),
      okinawaBase: blend(gdeltAgg.okinawaBase, rssIntel.riskScore),
      consumerStress: blend(gdeltAgg.consumerStress, rssIntel.riskScore),
      marketRisk: blend(gdeltAgg.marketRisk, rssIntel.riskScore)
    };
  }, [gdeltAgg, newsScores, rssIntel]);
  const sourceStatus = useMemo(() => {
    const fredLive = fredData.filter((point) => point.status === "live").length;
    const gdeltLive = newsScores.filter((topic) => topic.status === "live").length;
    const gdeltCache = newsScores.filter((topic) => topic.status === "cache").length;
    const gdeltFallback = newsScores.filter((topic) => topic.status === "fallback").length;
    const rssLive = rssIntel.liveCount;
    const rssTotal = rssIntel.total;
    const meta = getGdeltCacheMeta(selectedTimespan);
    const gdeltTotal = newsScores.length;
    const fredTotal = fredData.length;
    const tone: "good" | "warn" | "bad" = fredLive === fredTotal && gdeltLive === gdeltTotal ? "good" : fredLive === 0 ? "bad" : "warn";
    const label = gdeltLive === gdeltTotal && fredLive === fredTotal
      ? "Live model"
      : gdeltLive > 0 || rssLive > 0
        ? "Partial live model"
        : "FRED live / news cache";
    const detail = gdeltLive === gdeltTotal && fredLive === fredTotal
      ? `FRED ${fredLive}/${fredTotal} live + GDELT ${gdeltLive}/${gdeltTotal} live + RSS ${rssLive}/${rssTotal} live`
      : `FRED ${fredLive}/${fredTotal} live、GDELT live ${gdeltLive}/${gdeltTotal}・cache ${gdeltCache}・fallback ${gdeltFallback}、RSS ${rssLive}/${rssTotal} live`;
    return {
      label,
      detail,
      tone,
      fredLive,
      fredTotal,
      gdeltLive,
      gdeltTotal,
      gdeltCache,
      gdeltFallback,
      rssLive,
      rssTotal,
      gdeltRetryUntil: meta?.retryUntil
    };
  }, [fredData, newsScores, rssIntel, selectedTimespan]);
  const cpiYoY = fredYoY(fredData, "CPIAUCSL", 3.1);
  const fredFx = fredValue(fredData, "DEXJPUS", 156);
  const fx = manualFxOverride && selectedFx ? selectedFx : liveFxRate.quality === "observed" ? liveFxRate.value : selectedFx || fredFx;
  const strategicIntelligence = useMemo(() => computeStrategicIntelligence(fredData, newsScoresForPricing, fx), [fredData, newsScoresForPricing, fx]);
  const marketDataOps = useMemo(() => computeMarketDataOps(fredData, newsScoresForPricing, fx), [fredData, newsScoresForPricing, fx]);
  const marketTemperature = computeMarketTemperature({
    fx,
    cpiYoY,
    unemployment: fredValue(fredData, "UNRATE", 4.1),
    averageHourlyEarnings: fredValue(fredData, "CES0500000003", 35.5),
    consumerSentiment: fredValue(fredData, "UMCSENT", 61.8),
    geoRisk: newsAgg.geoRisk,
    forwardPosture: newsAgg.forwardPosture,
    okinawaBase: newsAgg.okinawaBase,
    strategicDemand: strategicIntelligence.strategicDemand
  });
  const range = recommendedRange(selectedIndustry, fx, cpiYoY, newsAgg.geoRisk);
  const score = calculatePurchaseScore({ item: selectedIndustry, segment: selectedSegment, area: selectedArea, priceJPY: price, fx, marketTemperature });

  const refreshAll = useCallback(async (forceGdelt = false) => {
    setLoading(true);
    const stamp = new Date().toLocaleString("ja-JP");
    setLogs((old) => [`${stamp} 更新開始`, ...old].slice(0, 20));
    try {
      const [fred, gdelt, fxRate, rss] = await Promise.all([fetchFred(envFredKey, fredInlineKey), fetchGdelt(selectedTimespan, { force: forceGdelt }), fetchExchangeRate(), fetchRssIntel()]);
      setFredData(fred.data);
      setNewsScores(gdelt.data);
      setLiveFxRate(fxRate.data);
      setRssIntel(rss.data);
      setSelectedFx(Number(fxRate.data.value.toFixed(2)));
      setManualFxOverride(false);
      setLogs((old) => [`${stamp} 更新完了`, ...rss.logs, ...fxRate.logs, ...fred.logs, ...gdelt.logs, ...old].slice(0, 30));
    } catch (error) {
      setLogs((old) => [`${stamp} 更新処理エラー: ${error instanceof Error ? error.message : "unknown"}`, ...old].slice(0, 30));
    } finally {
      setLoading(false);
    }
  }, [fredInlineKey, selectedTimespan]);

  useEffect(() => {
    localStorage.setItem("selectedIndustry", selectedIndustryId);
    localStorage.setItem("selectedSegment", selectedSegmentId);
    localStorage.setItem("selectedArea", selectedAreaName);
    localStorage.setItem("selectedFx", String(selectedFx));
    localStorage.setItem("selectedTimespan", selectedTimespan);
  }, [selectedIndustryId, selectedSegmentId, selectedAreaName, selectedFx, selectedTimespan]);

  useEffect(() => {
    setPrice((pricedIndustries.find((i) => i.id === selectedIndustryId) ?? pricedIndustries[1]).okinawaCurrent);
  }, [pricedIndustries, selectedIndustryId]);

  useEffect(() => {
    const last = localStorage.getItem("lastUpdated");
    const stale = !last || Date.now() - new Date(last).getTime() > 24 * 60 * 60 * 1000 || gdeltCacheNeedsRefresh(selectedTimespan);
    if (autoUpdate && stale) void refreshAll(false);
  }, [autoUpdate, refreshAll, selectedTimespan]);

  return (
    <div className="app-shell">
      <Header sourceStatus={sourceStatus} />
      <main className="dashboard-main">
        <KpiCards fx={fx} cpiYoY={cpiYoY} geoRisk={newsAgg.geoRisk} marketTemperature={marketTemperature} />
        <LiveFxPanel fxRate={liveFxRate} fredFx={fredFx} />
        <div className="grid-2">
          <AiConsultantPanel item={selectedIndustry} segment={selectedSegment} area={selectedArea} priceJPY={price} fx={fx} range={range} score={score} geoRisk={newsAgg.geoRisk} marketTemperature={marketTemperature} />
          <UpdateControls autoUpdate={autoUpdate} setAutoUpdate={setAutoUpdate} timespan={selectedTimespan} setTimespan={setSelectedTimespan} onRefresh={refreshAll} loading={loading} logs={logs} fredInlineKey={fredInlineKey} setFredInlineKey={setFredInlineKey} sourceStatus={sourceStatus} />
        </div>
        <TradingViewFxPanel />
        <StrategicIntelligencePanel intelligence={strategicIntelligence} />
        <GdeltImpactPanel scores={newsScores} />
        <UsPriceAnchorPanel fredData={fredData} newsScores={newsScores} industries={pricedIndustries} />
        <MarketDataOpsPanel ops={marketDataOps} />
        <BrowserResearchPanel rssIntel={rssIntel} />
        <PricingSimulator industries={pricedIndustries} segments={segments} areas={areas} selectedIndustry={selectedIndustry} selectedSegment={selectedSegment} selectedArea={selectedArea} price={price} fx={fx} cpiYoY={cpiYoY} geoRisk={newsAgg.geoRisk} marketTemperature={marketTemperature} setIndustry={setSelectedIndustryId} setSegment={setSelectedSegmentId} setArea={setSelectedAreaName} setPrice={setPrice} setFx={(value) => { setManualFxOverride(true); setSelectedFx(value); }} />
        <div className="grid-2">
          <GeoNewsPanel scores={newsScores} />
          <DailyMemoPanel fredData={fredData} newsScores={newsScores} marketTemperature={marketTemperature} fxOverride={fx} />
        </div>
        <div className="grid-2">
          <FredDataPanel data={fredData} />
          <NewsArticlePanel scores={newsScores} />
        </div>
        <AreaMarketMap areas={areas} />
        <SegmentCards segments={segments} />
        <IndustryTable industries={pricedIndustries} segment={selectedSegment} area={selectedArea} fx={fx} cpiYoY={cpiYoY} geoRisk={newsAgg.geoRisk} marketTemperature={marketTemperature} />
        <SourcesPanel />
      </main>
    </div>
  );
}
