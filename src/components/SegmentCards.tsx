import { Segment } from "../data/baseData";
import { usd } from "../utils/pricingEngine";

export function SegmentCards({ segments }: { segments: Segment[] }) {
  return (
    <section className="card print-light">
      <h2>7. ターゲット層別 消費心理</h2>
      <div className="grid-5">
        {segments.map((s) => (
          <article key={s.id} className="card light" style={{ padding: 14 }}>
            <div className="kpi-line"><strong>{s.label}</strong></div>
            <div className="kpi-line"><span className="small">月収モデル</span><span className="pill info">{usd(s.monthlyIncome)}/mo</span></div>
            <div className="kpi-line"><span className="small">価格感度</span><strong>{s.priceSensitivity.toFixed(2)}</strong></div>
            <div className="kpi-line"><span className="small">プレミアム許容</span><strong>{Math.round(s.premiumAppetite * 100)}%</strong></div>
            <p className="note">{s.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
