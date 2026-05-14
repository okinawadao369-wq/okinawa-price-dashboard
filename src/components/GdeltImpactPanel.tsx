import type { TopicScore } from "../utils/gdeltClient";
import { computeGdeltImpact } from "../utils/gdeltImpactEngine";

const tone = (value: number) => value >= 80 ? "good" : value >= 60 ? "warn" : "bad";
const signed = (value: number, suffix = "") => `${value >= 0 ? "+" : ""}${value.toFixed(1)}${suffix}`;

export function GdeltImpactPanel({ scores }: { scores: TopicScore[] }) {
  const impact = computeGdeltImpact(scores);

  return (
    <section className="card print-light gdelt-impact-panel">
      <div className="strategic-head">
        <div>
          <h2>GDELT影響度分析：ニュースが価格心理へ効く経路</h2>
          <p className="scenario">
            GDELT自動スコアは単独表示ではなく、推奨価格帯・購買市場温度・戦略需要・購買意欲スコアへ連動します。
            live取得が不足する日はcache/fallbackを明示し、価格判断では信頼度を下げて扱います。
          </p>
        </div>
        <div className="impact-card">
          <span className="small">GDELT品質</span>
          <strong>{impact.live}/{impact.total}</strong>
          <span className="small">live / topics</span>
        </div>
      </div>

      <div className="strategic-grid">
        {impact.metrics.map((metric) => (
          <div className="signal-card" key={metric.label}>
            <div className="signal-top">
              <span className="small">{metric.label}</span>
              <span className={`pill ${tone(metric.value)}`}>{Math.round(metric.value)}</span>
            </div>
            <div className="bar"><span style={{ width: `${Math.round(metric.value)}%` }} /></div>
            <p className="note">{metric.note}</p>
            <span className="pill info">
              {metric.label.includes("価格") ? signed(metric.impact, "%") : metric.label.includes("温度") || metric.label.includes("戦略") ? signed(metric.impact, "pt") : `${metric.impact} live`}
            </span>
          </div>
        ))}
      </div>

      <div className="strategic-summary">
        <div className="scenario">
          記事分類合計 {impact.totalArticles}件、リスク語 {impact.totalRiskHits}件、ポジティブ語 {impact.totalPositiveHits}件。
          地政学リスク {Math.round(impact.aggregate.geoRisk)}、東アジア緊張 {Math.round(impact.aggregate.eastAsiaTension)}、
          米軍前方展開 {Math.round(impact.aggregate.forwardPosture)}、沖縄基地関連 {Math.round(impact.aggregate.okinawaBase)}。
        </div>
        <div className="small">
          価格心理への現在寄与: 推奨価格帯 {signed(impact.priceRangeBoostPct, "%")}、市場温度 {signed(impact.marketTemperaturePoints, "pt")}、戦略需要 {signed(impact.strategicDemandPoints, "pt")}。
          状態: live={impact.live} / cache={impact.cache} / fallback={impact.fallback}
        </div>
      </div>
    </section>
  );
}
