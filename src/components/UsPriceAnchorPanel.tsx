import type { Industry } from "../data/baseData";
import { buildUsPriceAnchorContext } from "../utils/usPriceAnchorEngine";
import type { FredPoint } from "../utils/fredClient";
import type { TopicScore } from "../utils/gdeltClient";

const tone = (value: number) => value >= 80 ? "good" : value >= 60 ? "warn" : "bad";

export function UsPriceAnchorPanel({ fredData, newsScores, industries }: { fredData: FredPoint[]; newsScores: TopicScore[]; industries: Industry[] }) {
  const ctx = buildUsPriceAnchorContext(fredData, newsScores);
  const adjusted = industries.filter((item) => item.usPriceAdjustment && Math.abs(item.usPriceAdjustment - 1) > 0.01);
  const top = [...adjusted].sort((a, b) => (b.usPriceAdjustment ?? 1) - (a.usPriceAdjustment ?? 1)).slice(0, 6);

  return (
    <section className="card print-light us-price-anchor-panel">
      <div className="strategic-head">
        <div>
          <h2>米国単価アンカー自動補正：時給・インフレ・サービス価格</h2>
          <p className="scenario">
            FRED/BLS系の平均時給、CPI、Core CPI、外食CPI、ガソリン、GDELT消費ストレスを使い、
            各業種の米国単価を毎日補正します。公開価格が日次で確定できない業種は推計モデルとして明示します。
          </p>
        </div>
        <div className="impact-card">
          <span className="small">米国平均時給</span>
          <strong>${ctx.hourlyWage.toFixed(2)}</strong>
          <span className="small">FRED/BLS CES</span>
        </div>
      </div>

      <div className="strategic-grid">
        {ctx.pulses.map((pulse) => (
          <div className="signal-card" key={pulse.label}>
            <div className="signal-top">
              <span className="small">{pulse.label}</span>
              <span className={`pill ${tone(pulse.value)}`}>{Math.round(pulse.value)}</span>
            </div>
            <div className="bar"><span style={{ width: `${Math.round(pulse.value)}%` }} /></div>
            <p className="note">{pulse.note}</p>
          </div>
        ))}
      </div>

      <div className="table-wrap">
        <h3>米国単価補正が大きい業種</h3>
        <table>
          <thead>
            <tr>
              <th>業種</th>
              <th>基準米国単価</th>
              <th>補正後米国単価</th>
              <th>補正率</th>
              <th>反映根拠</th>
            </tr>
          </thead>
          <tbody>
            {top.map((item) => (
              <tr key={item.id}>
                <td><strong>{item.industry}</strong><div className="small">{item.group}</div></td>
                <td>${item.usLowBase ?? item.usLow} - ${item.usHighBase ?? item.usHigh}</td>
                <td><strong>${item.usLow} - ${item.usHigh}</strong></td>
                <td><span className={`pill ${(item.usPriceAdjustment ?? 1) >= 1.06 ? "good" : "warn"}`}>{(((item.usPriceAdjustment ?? 1) - 1) * 100).toFixed(1)}%</span></td>
                <td><span className="small">{item.usPriceSignal}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
