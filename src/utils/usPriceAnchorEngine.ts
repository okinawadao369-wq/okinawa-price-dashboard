import type { Industry } from "../data/baseData";
import type { FredPoint } from "./fredClient";
import { fredValue, fredYoY } from "./fredClient";
import type { TopicScore } from "./gdeltClient";
import { aggregateNews } from "./gdeltClient";
import { clamp } from "./pricingEngine";

export type UsAnchorPulse = {
  label: string;
  value: number;
  note: string;
};

function sectorFor(item: Industry) {
  if (item.group.includes("飲食") || item.id.includes("lunch") || item.id.includes("dinner") || item.id.includes("cafe")) return "food_service";
  if (item.id.includes("sitter")) return "childcare_care";
  if (item.id.includes("ft_2d") || item.id.includes("ft_4d") || item.id.includes("maternity") || item.id.includes("baby")) return "maternity_health";
  if (item.group.includes("美容") || item.id.includes("massage") || item.id.includes("acupuncture") || item.id.includes("hair")) return "personal_services";
  if (item.group.includes("生活") || item.id.includes("cleaning") || item.id.includes("translation") || item.id.includes("pet")) return "local_services";
  if (item.group.includes("写真") || item.id.includes("photo") || item.id.includes("tour")) return "experience_photo";
  if (item.group.includes("教育") || item.id.includes("lesson")) return "education";
  return "general";
}

function sectorMultiplier(sector: string, cpiYoY: number, coreCpiYoY: number, foodAwayYoY: number, hourlyWage: number, gasYoY: number, consumerStress: number) {
  const wageLift = clamp((hourlyWage - 35.5) / 35.5, -0.02, 0.08);
  const broadInflation = clamp((cpiYoY - 3) / 100, -0.03, 0.08);
  const coreLift = clamp((coreCpiYoY - 3) / 100, -0.03, 0.07);
  const foodLift = clamp((foodAwayYoY - 3.4) / 100, -0.03, 0.09);
  const gasLift = clamp(gasYoY / 100, -0.08, 0.12);
  const newsLift = clamp((consumerStress - 55) / 1000, -0.015, 0.035);

  const value =
    sector === "food_service" ? 1 + foodLift * 0.95 + wageLift * 0.75 + gasLift * 0.12 + newsLift :
    sector === "childcare_care" ? 1 + wageLift * 1.25 + coreLift * 0.45 + newsLift * 0.8 :
    sector === "maternity_health" ? 1 + coreLift * 0.55 + wageLift * 0.65 + newsLift * 0.5 :
    sector === "personal_services" ? 1 + wageLift * 0.9 + coreLift * 0.55 + newsLift * 0.45 :
    sector === "local_services" ? 1 + wageLift * 1.05 + gasLift * 0.18 + coreLift * 0.35 + newsLift * 0.45 :
    sector === "experience_photo" ? 1 + wageLift * 0.55 + broadInflation * 0.35 + newsLift * 0.25 :
    sector === "education" ? 1 + wageLift * 0.75 + coreLift * 0.35 + newsLift * 0.3 :
    1 + broadInflation * 0.55 + wageLift * 0.45 + newsLift * 0.3;

  return clamp(value, 0.93, 1.18);
}

export function buildUsPriceAnchorContext(fredData: FredPoint[], newsScores: TopicScore[]) {
  const cpiYoY = fredYoY(fredData, "CPIAUCSL", 3.1);
  const coreCpiYoY = fredYoY(fredData, "CPILFESL", 2.6);
  const foodAwayYoY = fredYoY(fredData, "CUSR0000SEFV", 3.2);
  const gasYoY = fredYoY(fredData, "APU000074714", 0);
  const hourlyWage = fredValue(fredData, "CES0500000003", 37.41);
  const news = aggregateNews(newsScores);
  const wagePressure = clamp(50 + (hourlyWage - 35.5) * 8 + cpiYoY * 2, 0, 100);
  const serviceInflation = clamp(45 + coreCpiYoY * 5 + foodAwayYoY * 3 + news.consumerStress * 0.12, 0, 100);

  const pulses: UsAnchorPulse[] = [
    { label: "米国平均時給", value: clamp(45 + (hourlyWage - 32) * 6, 0, 100), note: `$${hourlyWage.toFixed(2)}/hour をサービス単価の人件費アンカーに使用` },
    { label: "CPI/インフレ", value: clamp(45 + cpiYoY * 7 + coreCpiYoY * 2, 0, 100), note: `CPI YoY ${cpiYoY.toFixed(1)}%、Core ${coreCpiYoY.toFixed(1)}%` },
    { label: "外食・サービス価格", value: serviceInflation, note: `Food Away From Home YoY ${foodAwayYoY.toFixed(1)}% とニュース消費ストレスを合成` },
    { label: "賃金コスト圧力", value: wagePressure, note: "人件費型ビジネスの米国単価アンカーを押し上げる要因" }
  ];

  return { cpiYoY, coreCpiYoY, foodAwayYoY, gasYoY, hourlyWage, consumerStress: news.consumerStress, pulses };
}

export function adjustIndustryUsAnchors(industries: Industry[], fredData: FredPoint[], newsScores: TopicScore[]): Industry[] {
  const ctx = buildUsPriceAnchorContext(fredData, newsScores);
  return industries.map((item) => {
    const sector = sectorFor(item);
    const multiplier = sectorMultiplier(sector, ctx.cpiYoY, ctx.coreCpiYoY, ctx.foodAwayYoY, ctx.hourlyWage, ctx.gasYoY, ctx.consumerStress);
    const low = Math.max(1, item.usLow * multiplier);
    const high = Math.max(low, item.usHigh * multiplier);
    return {
      ...item,
      usLowBase: item.usLowBase ?? item.usLow,
      usHighBase: item.usHighBase ?? item.usHigh,
      usLow: Number(low.toFixed(low < 30 ? 2 : 0)),
      usHigh: Number(high.toFixed(high < 30 ? 2 : 0)),
      usPriceAdjustment: multiplier,
      usPriceQuality: "estimated",
      usPriceSignal: `米国時給 $${ctx.hourlyWage.toFixed(2)}、CPI ${ctx.cpiYoY.toFixed(1)}%、外食CPI ${ctx.foodAwayYoY.toFixed(1)}%、消費ストレス ${Math.round(ctx.consumerStress)} を反映`
    };
  });
}
