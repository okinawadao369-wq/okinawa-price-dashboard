import type { HousingExample, HousingSizeStandard, OhaRankBudget } from "../data/housingData";
import { HOUSING_CONVERSIONS, usMilitaryHousingSizeStandards } from "../data/housingData";
import { clamp, usd, yen } from "./pricingEngine";

export function sqftToSqm(sqft: number) {
  return sqft * HOUSING_CONVERSIONS.sqftToSqm;
}

export function sqmToTsubo(sqm: number) {
  return sqm * HOUSING_CONVERSIONS.sqmToTsubo;
}

export function tsuboToSqm(tsubo: number) {
  return tsubo * HOUSING_CONVERSIONS.tsuboToSqm;
}

export function calculateRentUnitPrices({
  rentJpy,
  rentUsd,
  sqm,
  tsubo,
  sqft
}: {
  rentJpy: number;
  rentUsd: number;
  sqm: number;
  tsubo: number;
  sqft: number;
}) {
  return {
    rentPerSqmJpy: rentJpy / sqm,
    rentPerTsuboJpy: rentJpy / tsubo,
    rentPerSqftUsd: rentUsd / sqft
  };
}

export function calculateAllowanceGap({ rentUsd, allowanceUsd }: { rentUsd: number; allowanceUsd: number }) {
  const gapUsd = allowanceUsd - rentUsd;
  const gapRatio = gapUsd / allowanceUsd;
  return {
    gapUsd,
    gapRatio,
    status: gapUsd >= 300 ? "余裕あり" : gapUsd >= 0 ? "範囲内" : gapUsd >= -200 ? "やや不足" : "不足"
  };
}

export function calculateSizeFitScore({ actualSqm, standardSqm }: { actualSqm: number; standardSqm: number }) {
  const ratio = actualSqm / standardSqm;
  if (ratio >= 1.05) return 100;
  if (ratio >= 0.95) return 92;
  if (ratio >= 0.85) return 80;
  if (ratio >= 0.75) return 65;
  if (ratio >= 0.65) return 50;
  return 35;
}

export function calculateHousingPsychologyScore({
  rentUsd,
  allowanceUsd,
  actualSqm,
  standardSqm,
  rentPerTsuboJpy,
  baseDistanceMinutes,
  bedrooms,
  parkingSpaces,
  petFriendly,
  englishContract,
  humidityResistant,
  familyRouteScore
}: {
  rentUsd: number;
  allowanceUsd: number;
  actualSqm: number;
  standardSqm: number;
  rentPerTsuboJpy: number;
  baseDistanceMinutes: number;
  bedrooms: number;
  parkingSpaces: number;
  petFriendly: boolean;
  englishContract: boolean;
  humidityResistant: boolean;
  familyRouteScore: number;
}) {
  const allowanceGap = calculateAllowanceGap({ rentUsd, allowanceUsd });
  const sizeFit = calculateSizeFitScore({ actualSqm, standardSqm });
  const allowanceScore = allowanceGap.gapUsd >= 300 ? 100 : allowanceGap.gapUsd >= 0 ? 88 : allowanceGap.gapUsd >= -200 ? 65 : 40;
  const unitPriceScore = rentPerTsuboJpy <= 7000 ? 95 : rentPerTsuboJpy <= 8500 ? 85 : rentPerTsuboJpy <= 10000 ? 72 : rentPerTsuboJpy <= 12000 ? 58 : 42;
  const distanceScore = baseDistanceMinutes <= 10 ? 100 : baseDistanceMinutes <= 15 ? 90 : baseDistanceMinutes <= 25 ? 75 : baseDistanceMinutes <= 35 ? 58 : 40;
  const bedroomScore = bedrooms >= 4 ? 95 : bedrooms === 3 ? 88 : bedrooms === 2 ? 60 : 35;
  const parkingScore = parkingSpaces >= 2 ? 100 : parkingSpaces === 1 ? 65 : 30;
  let optionScore = 0;
  optionScore += petFriendly ? 20 : 0;
  optionScore += englishContract ? 25 : 0;
  optionScore += humidityResistant ? 20 : 0;
  optionScore += familyRouteScore;
  optionScore = Math.min(optionScore, 100);
  const score = allowanceScore * 0.26 + sizeFit * 0.2 + unitPriceScore * 0.14 + distanceScore * 0.14 + bedroomScore * 0.1 + parkingScore * 0.08 + optionScore * 0.08;
  return Math.round(clamp(score, 0, 100));
}

export function calculateHousingToSpendingBoost({
  housingPsychologyScore,
  allowanceGapUsd,
  fx
}: {
  housingPsychologyScore: number;
  allowanceGapUsd: number;
  fx: number;
}) {
  let boost = 1;
  if (housingPsychologyScore >= 85) boost += 0.08;
  else if (housingPsychologyScore >= 70) boost += 0.04;
  else if (housingPsychologyScore < 55) boost -= 0.05;
  if (allowanceGapUsd >= 300) boost += 0.04;
  if (allowanceGapUsd < -200) boost -= 0.08;
  if (fx >= 160) boost += 0.06;
  else if (fx >= 150) boost += 0.03;
  else if (fx < 140) boost -= 0.04;
  return clamp(boost, 0.85, 1.2);
}

export function standardForBudget(budget: OhaRankBudget, bedrooms = 3): HousingSizeStandard {
  if (budget.id === "O6_EXECUTIVE") return usMilitaryHousingSizeStandards.find((s) => s.rankGroup === "O6")!;
  if (budget.id === "E9_O4_O5_GS_HIGH") return usMilitaryHousingSizeStandards.find((s) => s.rankGroup === "O4〜O5" && s.bedrooms === `${bedrooms}BR`) ?? usMilitaryHousingSizeStandards[4];
  if (budget.id === "E6_E8_O3_DEP") return usMilitaryHousingSizeStandards.find((s) => s.rankGroup === "E7/E8・W1〜W3・O3" && s.bedrooms === `${bedrooms}BR`) ?? usMilitaryHousingSizeStandards[2];
  return usMilitaryHousingSizeStandards.find((s) => s.rankGroup === "E1〜E6" && s.bedrooms === `${bedrooms}BR`) ?? usMilitaryHousingSizeStandards[0];
}

export function evaluateHousing(example: HousingExample, budget: OhaRankBudget, fx: number) {
  const rentUsd = example.rentUsd || example.rentJpy / fx;
  const rentPerTsuboJpy = example.rentPerTsuboJpy || example.rentJpy / example.tsubo;
  const standard = standardForBudget(budget, example.bedrooms);
  const allowanceGap = calculateAllowanceGap({ rentUsd, allowanceUsd: budget.rentAllowanceUsd });
  const sizeFitScore = calculateSizeFitScore({ actualSqm: example.sqm, standardSqm: standard.sqm });
  const housingPsychologyScore = calculateHousingPsychologyScore({
    rentUsd,
    allowanceUsd: budget.rentAllowanceUsd,
    actualSqm: example.sqm,
    standardSqm: standard.sqm,
    rentPerTsuboJpy,
    baseDistanceMinutes: example.baseDistanceMinutes ?? 25,
    bedrooms: example.bedrooms,
    parkingSpaces: example.parkingSpaces ?? 1,
    petFriendly: example.petFriendly ?? false,
    englishContract: example.englishContract ?? false,
    humidityResistant: example.humidityResistant ?? false,
    familyRouteScore: example.familyRouteScore ?? 55
  });
  const housingBoost = calculateHousingToSpendingBoost({ housingPsychologyScore, allowanceGapUsd: allowanceGap.gapUsd, fx });
  return {
    standard,
    allowanceGap,
    sizeFitScore,
    housingPsychologyScore,
    housingBoost,
    sizeRatio: example.sqm / standard.sqm,
    judgment: housingPsychologyScore >= 85 ? "住宅満足度が高く、家族サービス支出が残りやすい" : housingPsychologyScore >= 70 ? "OHA内で成立しやすく、通常消費は維持されやすい" : housingPsychologyScore >= 55 ? "立地や広さの説明で補強が必要" : "住宅ストレスが出やすく、外部消費は慎重になりやすい"
  };
}

export function housingBoostReason(score: number, gapUsd: number, fx: number) {
  const reasons = [];
  if (score >= 85) reasons.push("住宅満足度が高い");
  else if (score >= 70) reasons.push("住宅が実用許容帯にある");
  else if (score < 55) reasons.push("住宅ストレスが外部消費を抑える可能性");
  if (gapUsd >= 300) reasons.push("OHA家賃枠に余裕");
  else if (gapUsd >= 0) reasons.push("OHA家賃枠内");
  else reasons.push("OHA家賃枠を超過");
  if (fx >= 150) reasons.push("円建てサービスがドル所得から割安に見えやすい");
  return reasons.join(" / ");
}

export function housingConsultantText(args: {
  budget: OhaRankBudget;
  example: HousingExample;
  fx: number;
  servicePriceJpy: number;
  serviceLabel: string;
  basePurchaseScore: number;
  finalPurchaseScore: number;
}) {
  const result = evaluateHousing(args.example, args.budget, args.fx);
  return `【住宅心理診断】
対象ランク：${args.budget.label}
住宅予算：OHA家賃枠 ${usd(args.budget.rentAllowanceUsd)} / 約${yen(args.budget.rentAllowanceUsd * args.fx)}
想定物件：${args.example.label} ${args.example.bedrooms}BR / ${args.example.sqm.toFixed(1)}㎡ / ${args.example.tsubo.toFixed(1)}坪 / 家賃${yen(args.example.rentJpy)}
OHAとの差：約${usd(result.allowanceGap.gapUsd)}
面積適合：米軍基準${result.standard.sqm}㎡に対して${(result.sizeRatio * 100).toFixed(1)}%
坪単価：${yen(args.example.rentPerTsuboJpy)} / 坪
住宅満足度：${result.housingPsychologyScore} / 100
住宅ブースト：x${result.housingBoost.toFixed(2)}
価格心理：${args.serviceLabel} ${yen(args.servicePriceJpy)}は、OHA家賃枠の${((args.servicePriceJpy / (args.budget.rentAllowanceUsd * args.fx)) * 100).toFixed(1)}%です。
購買意欲：base ${Math.round(args.basePurchaseScore)} → housing adjusted ${Math.round(args.finalPurchaseScore)}

判断：
${result.judgment}。OHAは実費補填型で差額を自由に受け取る制度ではないため、余剰額そのものではなく「家賃が制度枠内に収まっている安心感」と「住宅満足度」が外部消費余力を押し上げる推計モデルとして扱います。`;
}
