import type { HousingExample, OhaRankBudget } from "../data/housingData";
import { okinawaMilitaryHousingExamples, okinawaOhaRankBudgets } from "../data/housingData";
import { evaluateHousing, housingBoostReason } from "../utils/housingPsychologyEngine";
import { yen, usd } from "../utils/pricingEngine";

function tone(score: number) {
  if (score >= 80) return "good";
  if (score >= 60) return "warn";
  return "bad";
}

export function HousingImpactPanel(props: {
  budget: OhaRankBudget;
  example: HousingExample;
  fx: number;
  basePurchaseScore: number;
  finalPurchaseScore: number;
  housingBoost: number;
  setBudget: (id: string) => void;
  setExample: (id: string) => void;
}) {
  const result = evaluateHousing(props.example, props.budget, props.fx);
  return (
    <section className="card ai print-light">
      <h2>住宅制度 4. Housing Impact on Purchase Power</h2>
      <div className="form-row">
        <div>
          <label className="field-label">住宅ランク/OHAモデル</label>
          <select value={props.budget.id} onChange={(e) => props.setBudget(e.target.value)}>
            {okinawaOhaRankBudgets.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label">想定住宅</label>
          <select value={props.example.id} onChange={(e) => props.setExample(e.target.value)}>
            {okinawaMilitaryHousingExamples.map((item) => <option key={item.id} value={item.id}>{item.label} / {yen(item.rentJpy)}</option>)}
          </select>
        </div>
      </div>
      <div className="summary-box" style={{ marginTop: 18 }}>
        <div className="grid-4">
          <Metric label="Base Purchase Score" value={`${Math.round(props.basePurchaseScore)}`} sub="住宅補正前" />
          <Metric label="Housing Psychology" value={`${result.housingPsychologyScore}`} sub={`${result.judgment}`} tone={tone(result.housingPsychologyScore)} />
          <Metric label="Housing Boost" value={`x${props.housingBoost.toFixed(2)}`} sub={housingBoostReason(result.housingPsychologyScore, result.allowanceGap.gapUsd, props.fx)} />
          <Metric label="Final Purchase Score" value={`${Math.round(props.finalPurchaseScore)}`} sub="住宅心理補正後" tone={tone(props.finalPurchaseScore)} />
        </div>
        <div className="card light">
          <p className="scenario">
            この物件は、{props.budget.label} のOHA家賃枠 {usd(props.budget.rentAllowanceUsd)} に対して
            約 {usd(result.allowanceGap.gapUsd)} の差があります。面積は {props.example.sqm.toFixed(1)}㎡で、
            米軍基準 {result.standard.sqm}㎡ に対して {(result.sizeRatio * 100).toFixed(1)}% です。
            家賃が制度枠内で処理されやすく、住宅満足度が高い場合、FamilyTreeOki、医療系ベビーシッター、写真、飲食への支出余力は残りやすい推計です。
          </p>
        </div>
      </div>
      <p className="note">
        本モジュールは公開資料、米軍住宅制度、OHA/BAHモデル、物件公開例を基にしたマーケティング意思決定支援ツールです。実際の入居可否、米軍承認、OHA支給可否、契約条件は各Housing Office、物件管理会社、米軍規定で確認してください。
        OHAは実費補填型であり、上限より安い物件に住んでも差額を自由に受け取れる制度ではありません。米国BAHはOHAと制度性質が異なり、単純比較には注意が必要です。
      </p>
    </section>
  );
}

function Metric({ label, value, sub, tone = "info" }: { label: string; value: string; sub: string; tone?: string }) {
  return (
    <div className="card light metric" style={{ padding: 14 }}>
      <div className="label">{label}</div>
      <div className={`value ${tone}`} style={{ fontSize: 24 }}>{value}</div>
      <div className="sub">{sub}</div>
    </div>
  );
}
