import type { TopicScore } from "./gdeltClient";
import { aggregateNews } from "./gdeltClient";
import { clamp } from "./pricingEngine";

export type GdeltImpactMetric = {
  label: string;
  value: number;
  impact: number;
  note: string;
};

export function computeGdeltImpact(scores: TopicScore[]) {
  const news = aggregateNews(scores);
  const live = scores.filter((score) => score.status === "live").length;
  const cache = scores.filter((score) => score.status === "cache").length;
  const fallback = scores.filter((score) => score.status === "fallback").length;
  const totalArticles = scores.reduce((sum, score) => sum + score.articleCount, 0);
  const totalRiskHits = scores.reduce((sum, score) => sum + score.riskWordHits, 0);
  const totalPositiveHits = scores.reduce((sum, score) => sum + score.positiveWordHits, 0);

  const priceRangeBoostPct = clamp((news.geoRisk - 55) / 10, -2, 5);
  const marketTemperaturePoints =
    (news.geoRisk - 50) * 0.08 +
    (news.forwardPosture - 50) * 0.1 +
    (news.okinawaBase - 50) * 0.12;
  const strategicDemandPoints =
    (news.forwardPosture - 50) * 0.28 +
    (news.eastAsiaTension - 50) * 0.16 -
    (news.marketRisk - 50) * 0.11;
  const confidence = clamp((live / Math.max(scores.length, 1)) * 100 + Math.min(totalArticles, 150) * 0.12 - fallback * 8, 0, 100);

  const metrics: GdeltImpactMetric[] = [
    {
      label: "推奨価格帯への上乗せ",
      value: clamp(50 + priceRangeBoostPct * 10, 0, 100),
      impact: priceRangeBoostPct,
      note: "geoRiskが55を超えるほど、沖縄推奨価格帯を最大約+5%まで押し上げます。"
    },
    {
      label: "購買市場温度への寄与",
      value: clamp(50 + marketTemperaturePoints * 5, 0, 100),
      impact: marketTemperaturePoints,
      note: "geoRisk、米軍前方展開、沖縄基地関連指数を市場温度へ加算します。"
    },
    {
      label: "戦略需要への寄与",
      value: clamp(50 + strategicDemandPoints * 3, 0, 100),
      impact: strategicDemandPoints,
      note: "東アジア緊張と前方展開が強いほど、沖縄米軍コミュニティ需要を強めます。"
    },
    {
      label: "データ信頼度",
      value: confidence,
      impact: live,
      note: "live取得数、記事数、fallback数から、その日のニューススコアの使いやすさを判定します。"
    }
  ];

  return {
    aggregate: news,
    live,
    cache,
    fallback,
    total: scores.length,
    totalArticles,
    totalRiskHits,
    totalPositiveHits,
    priceRangeBoostPct,
    marketTemperaturePoints,
    strategicDemandPoints,
    confidence,
    metrics
  };
}
