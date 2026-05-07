import { industries } from "../data/baseData";
import { sectorPriceBenchmarks, type EvidenceQuality } from "../data/monitoringSources";
import type { FredPoint } from "./fredClient";
import { fredValue, fredYoY } from "./fredClient";
import type { TopicScore } from "./gdeltClient";
import { aggregateNews } from "./gdeltClient";
import { clamp, recommendedRange } from "./pricingEngine";

export type MarketPulse = {
  label: string;
  value: number;
  quality: EvidenceQuality;
  note: string;
};

export type SectorPulse = {
  sector: string;
  pressure: number;
  upsideRoom: number;
  quality: EvidenceQuality;
  updateCadence: string;
  observedSignal: string;
  dashboardUse: string;
};

export function computeMarketDataOps(fredData: FredPoint[], newsScores: TopicScore[], fx: number) {
  const news = aggregateNews(newsScores);
  const cpiYoY = fredYoY(fredData, "CPIAUCSL", 3.1);
  const coreCpiYoY = fredYoY(fredData, "CPILFESL", 3.0);
  const foodAwayYoY = fredYoY(fredData, "CUSR0000SEFV", 3.8);
  const gasYoY = fredYoY(fredData, "APU000074714", 0);
  const hourlyEarnings = fredValue(fredData, "CES0500000003", 35.5);
  const unemployment = fredValue(fredData, "UNRATE", 4.1);
  const fedFunds = fredValue(fredData, "FEDFUNDS", 4.33);
  const dgs10 = fredValue(fredData, "DGS10", 4.45);
  const sentiment = fredValue(fredData, "UMCSENT", 61.8);

  const pulses: MarketPulse[] = [
    {
      label: "米国ミクロ価格圧力",
      value: clamp(45 + cpiYoY * 4 + coreCpiYoY * 2 + foodAwayYoY * 2 + Math.max(0, gasYoY) * 0.8 + news.consumerStress * 0.1, 0, 100),
      quality: "observed",
      note: "CPI/Core CPI/外食CPI/ガソリン/GDELT生活費ニュースを合成。"
    },
    {
      label: "家計所得・雇用余力",
      value: clamp(52 + (hourlyEarnings - 32) * 2.2 + (4.8 - unemployment) * 5 + (sentiment - 60) * 0.18, 0, 100),
      quality: "observed",
      note: "平均時給、失業率、消費者心理から可処分所得の余力を推計。"
    },
    {
      label: "金融・財政ストレス",
      value: clamp(35 + fedFunds * 5 + dgs10 * 4 + news.marketRisk * 0.18, 0, 100),
      quality: "observed",
      note: "FRB金利、10年金利、財政/市場ニュース。高いほど低単価層は慎重。"
    },
    {
      label: "企業価格ニュース熱量",
      value: clamp(news.consumerStress * 0.65 + news.marketRisk * 0.35, 0, 100),
      quality: "observed",
      note: "小売、外食、値引き、値上げ、需要鈍化ニュースをGDELTで日次検索。"
    },
    {
      label: "円建て割安感",
      value: clamp(50 + (fx - 135) * 1.5, 0, 100),
      quality: "observed",
      note: "USD/JPYが高いほど米軍・軍属から見た円価格は割安に見える。"
    }
  ];

  const sectorPulses: SectorPulse[] = sectorPriceBenchmarks.map((benchmark) => {
    const rows = industries.filter((industry) => {
      if (benchmark.id === "restaurant") return industry.group === "飲食業";
      if (benchmark.id === "childcare") return industry.id.includes("sitter");
      if (benchmark.id === "ultrasound") return industry.id.includes("ft_2d") || industry.id.includes("ft_4d");
      if (benchmark.id === "beauty") return industry.group === "美容・ウェルネス";
      if (benchmark.id === "home_service") return industry.group === "生活サービス";
      if (benchmark.id === "photo_experience") return industry.group === "体験・写真" || industry.id.includes("keepsake");
      if (benchmark.id === "education") return industry.group === "教育・その他";
      return false;
    });
    const upside = rows.length
      ? rows.reduce((sum, item) => {
          const [low, high] = recommendedRange(item, fx, cpiYoY, news.geoRisk);
          const midpoint = (low + high) / 2;
          return sum + clamp((midpoint - item.okinawaCurrent) / Math.max(item.okinawaCurrent, 1), -0.5, 1);
        }, 0) / rows.length
      : 0;
    const pressure = clamp(55 + upside * 35 + pulses[0].value * 0.12 + pulses[4].value * 0.08 - pulses[2].value * 0.06, 0, 100);
    return {
      sector: benchmark.sector,
      pressure,
      upsideRoom: upside,
      quality: benchmark.quality,
      updateCadence: benchmark.updateCadence,
      observedSignal: benchmark.observedSignal,
      dashboardUse: benchmark.dashboardUse
    };
  });

  const observed = pulses.filter((p) => p.quality === "observed").length + sectorPulses.filter((p) => p.quality === "observed").length;
  const estimated = pulses.filter((p) => p.quality === "estimated").length + sectorPulses.filter((p) => p.quality === "estimated").length;
  const fallback = pulses.filter((p) => p.quality === "fallback").length + sectorPulses.filter((p) => p.quality === "fallback").length;
  const unknown = pulses.filter((p) => p.quality === "unknown").length + sectorPulses.filter((p) => p.quality === "unknown").length;

  return {
    pulses,
    sectorPulses,
    qualityCounts: { observed, estimated, fallback, unknown },
    dailyUpdateText: "ブラウザ起動時または手動更新時に、24時間超のキャッシュを更新。Vercel本番ではFREDはサーバー側プロキシ、GDELTはフロントから日次検索します。"
  };
}
