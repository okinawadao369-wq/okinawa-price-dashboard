import type { HousingExample, OhaRankBudget } from "../data/housingData";
import { japanMainlandMilitaryHousingExamples, okinawaMilitaryHousingExamples, usMilitaryHousingExamples } from "../data/housingData";
import { calculateAllowanceGap, calculateSizeFitScore, standardForBudget } from "../utils/housingPsychologyEngine";
import { yen, usd } from "../utils/pricingEngine";

const allExamples = [...okinawaMilitaryHousingExamples, ...japanMainlandMilitaryHousingExamples, ...usMilitaryHousingExamples];

function tone(score: number) {
  if (score >= 80) return "good";
  if (score >= 60) return "warn";
  return "bad";
}

export function HousingExampleComparator({ budget, fx }: { budget: OhaRankBudget; fx: number }) {
  return (
    <section className="card print-light">
      <h2>住宅制度 2. 沖縄・日本本土・米国本土 住宅比較</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>地域</th>
              <th>物件</th>
              <th>BR</th>
              <th>sqft / ㎡ / 坪</th>
              <th>家賃</th>
              <th>単価</th>
              <th>OHA/BAH差</th>
              <th>面積適合</th>
              <th>心理判定</th>
            </tr>
          </thead>
          <tbody>
            {allExamples.map((example) => <HousingRow key={example.id} example={example} budget={budget} fx={fx} />)}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function HousingRow({ example, budget, fx }: { example: HousingExample; budget: OhaRankBudget; fx: number }) {
  const rentUsd = example.rentUsd || example.rentJpy / fx;
  const allowance = example.market.includes("San Diego") ? 3975 : budget.rentAllowanceUsd;
  const gap = calculateAllowanceGap({ rentUsd, allowanceUsd: allowance });
  const standard = standardForBudget(budget, example.bedrooms);
  const sizeScore = calculateSizeFitScore({ actualSqm: example.sqm, standardSqm: standard.sqm });
  return (
    <tr>
      <td><span className="pill info">{example.market}</span></td>
      <td><strong>{example.label}</strong><br /><span className="small">{example.area ?? ""} {example.note}</span></td>
      <td>{example.bedrooms}BR</td>
      <td>{example.sqft.toLocaleString()} sqft<br />{example.sqm.toFixed(1)}㎡ / {example.tsubo.toFixed(1)}坪</td>
      <td>{yen(example.rentJpy)}<br /><span className="small">{usd(rentUsd)}</span></td>
      <td>{yen(example.rentPerTsuboJpy)}/坪<br /><span className="small">{usd(example.rentPerSqftUsd)}/sqft</span></td>
      <td><span className={`pill ${gap.gapUsd >= 0 ? "good" : "bad"}`}>{gap.status} {usd(gap.gapUsd)}</span></td>
      <td><span className={`pill ${tone(sizeScore)}`}>{sizeScore}</span><br /><span className="small">基準 {standard.sqm}㎡</span></td>
      <td>{sizeScore >= 80 && gap.gapUsd >= 0 ? "米軍家族から見て成立しやすい" : gap.gapUsd < 0 ? "制度枠超過。価値説明が必要" : "広さ/立地の補足説明が必要"}</td>
    </tr>
  );
}
