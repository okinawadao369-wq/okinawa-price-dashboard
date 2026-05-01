import type { Area, Industry, Segment } from "../data/baseData";

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
export const roundToNearest100 = (value: number) => Math.round(value / 100) * 100;
export const yen = (value: number) => `¥${Math.round(value).toLocaleString("ja-JP")}`;
export const usd = (value: number) => `$${value.toLocaleString("en-US", { maximumFractionDigits: value < 10 ? 2 : 0 })}`;

export function recommendedRange(item: Industry, fx: number, cpiYoY: number, geoRisk: number): [number, number] {
  const inflationLift = clamp(1 + (cpiYoY - 3) / 100, 0.96, 1.09);
  const geoBoost = clamp(1 + (geoRisk - 55) / 1000, 0.98, 1.05);
  const low = item.usLow * fx * item.discount * inflationLift * geoBoost;
  const high = item.usHigh * fx * Math.min(0.96, item.discount + 0.16) * item.premium * inflationLift * geoBoost;
  return [roundToNearest100(low), roundToNearest100(high)];
}

export function calculatePurchaseScore(input: {
  item: Industry;
  segment: Segment;
  area: Area;
  priceJPY: number;
  fx: number;
  marketTemperature: number;
}) {
  const { item, segment, area, priceJPY, fx, marketTemperature } = input;
  const usMid = (item.usLow + item.usHigh) / 2;
  const usMidJPY = usMid * fx;
  const ratio = usMidJPY / Math.max(priceJPY, 1);
  let anchorScore = 50 + (ratio - 1) * 42;
  anchorScore = clamp(anchorScore, 0, 100) * Math.min(1.2, item.premium);
  const priceUSD = priceJPY / fx;
  const monthlyBurden = priceUSD / segment.monthlyIncome;
  let affordabilityScore = 30;
  if (monthlyBurden < 0.008) affordabilityScore = 100;
  else if (monthlyBurden < 0.015) affordabilityScore = 92;
  else if (monthlyBurden < 0.03) affordabilityScore = 80;
  else if (monthlyBurden < 0.05) affordabilityScore = 65;
  else if (monthlyBurden < 0.08) affordabilityScore = 48;
  affordabilityScore = affordabilityScore / segment.priceSensitivity;
  const needScore = item.need * 100 * (0.85 + segment.premiumAppetite * 0.18);
  const trustScore = Math.min(100, item.premium * 72);
  const areaScore = area.affinity;
  const macroBoost = (marketTemperature - 70) * 0.08;
  const score = anchorScore * 0.43 + affordabilityScore * 0.24 + needScore * 0.16 + trustScore * 0.09 + areaScore * 0.05 + macroBoost;
  return clamp(score, 0, 100);
}

export function computeMarketTemperature(input: {
  fx: number;
  cpiYoY: number;
  unemployment: number;
  averageHourlyEarnings: number;
  consumerSentiment: number;
  geoRisk: number;
  forwardPosture: number;
  okinawaBase: number;
}) {
  const { fx, cpiYoY, unemployment, averageHourlyEarnings, consumerSentiment, geoRisk, forwardPosture, okinawaBase } = input;
  let score = 50;
  score += clamp((fx - 130) / 2.2, 0, 18);
  score += clamp((averageHourlyEarnings - 30) * 0.75, -8, 8);
  score += clamp((4.8 - unemployment) * 4, -10, 6);
  score += clamp((cpiYoY - 2.5) * 2, -5, 8);
  score += clamp((consumerSentiment - 60) * 0.25, -8, 6);
  score += (geoRisk - 50) * 0.08;
  score += (forwardPosture - 50) * 0.1;
  score += (okinawaBase - 50) * 0.12;
  return clamp(Math.round(score), 0, 100);
}

export const scoreClass = (score: number) => {
  if (score >= 80) return "text-emerald-300 bg-emerald-400/10 border-emerald-400/30";
  if (score >= 60) return "text-amber-200 bg-amber-400/10 border-amber-400/30";
  return "text-rose-200 bg-rose-400/10 border-rose-400/30";
};

export function verdict(score: number) {
  if (score >= 82) return "割安感が強く、値上げまたは上位パッケージ余地あり";
  if (score >= 68) return "買いやすい。訴求文とドル併記で成約率を上げられる";
  if (score >= 55) return "許容範囲。対象セグメントや特典設計で補強が必要";
  return "心理価格から外れやすい。価格・内容・信頼証明の再設計が必要";
}

export function consultantText(args: {
  item: Industry;
  segment: Segment;
  area: Area;
  priceJPY: number;
  fx: number;
  range: [number, number];
  score: number;
  geoRisk: number;
  marketTemperature: number;
}) {
  const { item, segment, area, priceJPY, fx, range, score, geoRisk, marketTemperature } = args;
  const upside = Math.max(0, range[1] - priceJPY);
  const premiumLine = item.id.includes("ft_4d")
    ? "Private 1-Hour Ultrasound Experience / English-supported care for U.S. military families in Okinawa / We do not rush your session."
    : `Okinawa-based ${item.industry} with clear English booking, trusted local support, and U.S.-comparable value.`;
  return `【AIコンサル診断】
業種：${item.industry}
ターゲット：${segment.label}
エリア：${area.area}
入力価格：${yen(priceJPY)}（約${usd(priceJPY / fx)}）
米国単価：${usd(item.usLow)}〜${usd(item.usHigh)} / ${item.unit}
沖縄推奨価格帯：${yen(range[0])}〜${yen(range[1])}
購買意欲スコア：${Math.round(score)} / 100
地政学リスク：${Math.round(geoRisk)}
市場温度：${Math.round(marketTemperature)}

判断：
${verdict(score)}。米国単価アンカーと比較し、現在価格は${priceJPY < range[0] ? "入口価格として強すぎるため上位単価の設計余地が大きい" : priceJPY <= range[1] ? "有効価格帯の中にあり、ドル併記と信頼証明で伸ばしやすい" : "上限寄りのため、保証・専門性・英語導線の補強が必要"}。

値上げ余地：
推計上の上限との差は約${yen(upside)}。急な一律値上げではなく、通常価格・上位パッケージ・アップセルを分けて設計する。

英語での売り方：
${premiumLine}

広告戦略：
Facebook groups / Google Maps / spouse community / PCS and maternity keywordsで、円価格の横にabout ${usd(priceJPY / fx)}を表示。対象は${segment.label}、商圏は${area.area}を優先。

次の打ち手：
1. 円価格の横にドル換算を表示
2. 推奨価格帯の上半分で上位パッケージを作る
3. 口コミ・英語予約・キャンセル条件を見える化
4. FamilyTreeOki系は記念体験と安心ケアを中心に売る`;
}
