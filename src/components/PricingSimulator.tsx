import { Area, Industry, Segment } from "../data/baseData";
import { calculatePurchaseScore, recommendedRange, usd, verdict, yen } from "../utils/pricingEngine";

function scoreTone(score: number) {
  if (score >= 80) return "good";
  if (score >= 60) return "warn";
  return "bad";
}

export function PricingSimulator(props: {
  industries: Industry[];
  segments: Segment[];
  areas: Area[];
  selectedIndustry: Industry;
  selectedSegment: Segment;
  selectedArea: Area;
  price: number;
  fx: number;
  cpiYoY: number;
  geoRisk: number;
  marketTemperature: number;
  setIndustry: (id: string) => void;
  setSegment: (id: string) => void;
  setArea: (area: string) => void;
  setPrice: (value: number) => void;
  setFx: (value: number) => void;
}) {
  const range = recommendedRange(props.selectedIndustry, props.fx, props.cpiYoY, props.geoRisk);
  const score = calculatePurchaseScore({ item: props.selectedIndustry, segment: props.selectedSegment, area: props.selectedArea, priceJPY: props.price, fx: props.fx, marketTemperature: props.marketTemperature });
  const usMidJPY = ((props.selectedIndustry.usLow + props.selectedIndustry.usHigh) / 2) * props.fx;
  const diff = props.price - range[0];
  const tone = scoreTone(score);

  return (
    <section className="card print-light">
      <h2>1. 業種別 価格心理シミュレーター</h2>
      <div className="form-row">
        <div>
          <label className="field-label">業種</label>
          <select value={props.selectedIndustry.id} onChange={(e) => props.setIndustry(e.target.value)}>
            {props.industries.map((i) => <option key={i.id} value={i.id}>{i.group}｜{i.industry}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label">沖縄価格 / 入力単価（円）</label>
          <input type="number" step={100} value={props.price} onChange={(e) => props.setPrice(Number(e.target.value))} />
        </div>
        <div>
          <label className="field-label">為替 USD/JPY</label>
          <input type="number" step={0.1} value={props.fx} onChange={(e) => props.setFx(Number(e.target.value))} />
        </div>
        <div>
          <label className="field-label">ターゲット層</label>
          <select value={props.selectedSegment.id} onChange={(e) => props.setSegment(e.target.value)}>
            {props.segments.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label">商圏エリア</label>
          <select value={props.selectedArea.area} onChange={(e) => props.setArea(e.target.value)}>
            {props.areas.map((a) => <option key={a.area} value={a.area}>{a.area}</option>)}
          </select>
        </div>
      </div>

      <div className="summary-box" style={{ marginTop: 18 }}>
        <div className="grid-4">
          <Metric label="米国単価アンカー" value={`${usd(props.selectedIndustry.usLow)}〜${usd(props.selectedIndustry.usHigh)}`} sub={`${yen(props.selectedIndustry.usLow * props.fx)}〜${yen(props.selectedIndustry.usHigh * props.fx)} / ${props.selectedIndustry.unit}`} />
          <Metric label="入力価格のドル換算" value={usd(props.price / props.fx)} sub="米軍顧客の体感価格" />
          <Metric label="沖縄推奨価格帯" value={`${yen(range[0])}〜${yen(range[1])}`} sub="米国単価 x 円安 x 沖縄割安感" />
          <Metric label="価格差" value={diff < 0 ? `${yen(Math.abs(diff))}低い` : `${yen(diff)}上`} sub={diff < 0 ? "推奨下限より安い＝値上げ余地あり" : props.price <= range[1] ? "推奨帯の範囲内" : "推奨上限超え。価値説明が必要"} />
        </div>
        <div className="card light metric">
          <div className="label">購買意欲スコア</div>
          <div className={`score-text ${tone}`}>{Math.round(score)}</div>
          <div className="bar"><span style={{ width: `${Math.round(score)}%` }} /></div>
          <p className="scenario">
            <strong>{score >= 84 ? "非常に強い" : score >= 70 ? "強い" : score >= 58 ? "中程度" : "弱い"}</strong>：{verdict(score)}
            <br />
            米国相場中央値の円換算は {yen(usMidJPY)}。{props.selectedIndustry.comment}
          </p>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="card light metric" style={{ padding: 14 }}>
      <div className="label">{label}</div>
      <div className="value" style={{ fontSize: 22 }}>{value}</div>
      <div className="sub">{sub}</div>
    </div>
  );
}
