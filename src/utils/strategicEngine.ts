import { strategicFactors } from "../data/strategicIntelligence";
import type { FredPoint } from "./fredClient";
import { fredValue, fredYoY } from "./fredClient";
import type { TopicScore } from "./gdeltClient";
import { aggregateNews } from "./gdeltClient";
import { clamp } from "./pricingEngine";

export type StrategicSignal = {
  label: string;
  value: number;
  note: string;
};

export function computeStrategicIntelligence(fredData: FredPoint[], newsScores: TopicScore[], manualFx: number) {
  const news = aggregateNews(newsScores);
  const fx = manualFx || fredValue(fredData, "DEXJPUS", 156);
  const cpiYoY = fredYoY(fredData, "CPIAUCSL", 3.1);
  const fedFunds = fredValue(fredData, "FEDFUNDS", 4.33);
  const consumerSentiment = fredValue(fredData, "UMCSENT", 61.8);

  const commandFunctionIndex = clamp(
    0.55 * strategicFactors.find((f) => f.id === "usfj_joint_hq")!.baseScore +
      0.45 * strategicFactors.find((f) => f.id === "mlr_okinawa")!.baseScore,
    0,
    100
  );
  const okinawaForwardPostureIndex = clamp(commandFunctionIndex * 0.55 + news.forwardPosture * 0.25 + news.okinawaBase * 0.2, 0, 100);
  const relocationDragIndex = strategicFactors.find((f) => f.id === "guam_force_flow")!.baseScore;
  const taiwanContingencyIndex = clamp(news.eastAsiaTension * 0.55 + strategicFactors.find((f) => f.id === "taiwan_east_asia")!.baseScore * 0.45, 0, 100);
  const usPoliticalFiscalIndex = clamp(news.marketRisk * 0.35 + news.consumerStress * 0.25 + cpiYoY * 5 + fedFunds * 4 + (70 - consumerSentiment) * 0.35, 0, 100);
  const mediaRiskIndex = clamp(news.geoRisk * 0.5 + taiwanContingencyIndex * 0.3 + usPoliticalFiscalIndex * 0.2, 0, 100);
  const fxDiscountIndex = clamp(55 + (fx - 145) * 1.4, 0, 100);

  const baseImpact = strategicFactors.reduce((sum, factor) => sum + factor.priceImpact, 0);
  const liveImpact =
    (okinawaForwardPostureIndex - 65) * 0.06 +
    (taiwanContingencyIndex - 60) * 0.035 +
    (fxDiscountIndex - 60) * 0.04 -
    (usPoliticalFiscalIndex - 60) * 0.025 -
    Math.max(0, relocationDragIndex - 55) * 0.02;
  const pricePsychologyImpact = clamp(baseImpact + liveImpact, -6, 10);
  const strategicDemand = clamp(55 + okinawaForwardPostureIndex * 0.28 + taiwanContingencyIndex * 0.16 + fxDiscountIndex * 0.16 - usPoliticalFiscalIndex * 0.11 - relocationDragIndex * 0.06, 0, 100);

  const signals: StrategicSignal[] = [
    { label: "米軍前方展開/統合司令部指数", value: okinawaForwardPostureIndex, note: "USFJ統合司令部化、12th MLR、GDELT前方展開ニュースを合成。" },
    { label: "台湾・東アジア緊張指数", value: taiwanContingencyIndex, note: "台湾海峡、北朝鮮、インド太平洋ニュース量から推計。" },
    { label: "沖縄基地再編ドラッグ", value: relocationDragIndex, note: "グアム移転開始による人口不安。高いほど商圏には慎重材料。" },
    { label: "米国政治経済ストレス", value: usPoliticalFiscalIndex, note: "FRED金利・CPI・消費者心理とGDELT市場/政治ニュースを合成。" },
    { label: "価格心理影響度", value: clamp(50 + pricePsychologyImpact * 5, 0, 100), note: `推奨価格帯へ約${pricePsychologyImpact >= 0 ? "+" : ""}${pricePsychologyImpact.toFixed(1)}%相当の上振れ/下振れ圧力。` }
  ];

  const recommendation =
    pricePsychologyImpact >= 5
      ? "高付加価値パッケージとドル換算表示を前面に出す局面。政治色ではなく、安心・英語対応・米国相場より割安を訴求。"
      : pricePsychologyImpact >= 1
        ? "現行価格は維持しつつ、上位プラン・家族向けオプション・紹介導線で単価を上げる局面。"
        : "低単価入口を残し、米国経済ストレスや再編不安に備えてレビュー・キャンセル条件・予約しやすさを強化。";

  return {
    signals,
    factors: strategicFactors,
    commandFunctionIndex,
    okinawaForwardPostureIndex,
    relocationDragIndex,
    taiwanContingencyIndex,
    usPoliticalFiscalIndex,
    mediaRiskIndex,
    fxDiscountIndex,
    pricePsychologyImpact,
    strategicDemand,
    recommendation
  };
}
