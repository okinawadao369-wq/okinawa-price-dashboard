import type { computeStrategicIntelligence } from "../utils/strategicEngine";

type StrategicIntelligence = ReturnType<typeof computeStrategicIntelligence>;

const sourceLabel = (kind: string) => {
  if (kind === "official") return "公式";
  if (kind === "market") return "市場";
  if (kind === "media") return "報道";
  return "推計";
};

const pillTone = (score: number) => score >= 80 ? "good" : score >= 60 ? "warn" : "bad";

export function StrategicIntelligencePanel({ intelligence }: { intelligence: StrategicIntelligence }) {
  return (
    <section className="card print-light strategic-panel">
      <div className="strategic-head">
        <div>
          <h2>国際政治経済・米軍再編インテリジェンス</h2>
          <p className="scenario">
            Al Jazeera、Bloomberg、公式発表、GDELT、FREDを組み合わせ、沖縄米軍の機能変化が価格心理に与える影響を推計モデルとして数値化します。
          </p>
        </div>
        <div className="impact-card">
          <span className="small">推計価格心理インパクト</span>
          <strong>{intelligence.pricePsychologyImpact >= 0 ? "+" : ""}{intelligence.pricePsychologyImpact.toFixed(1)}%</strong>
          <span className="small">市場温度に反映済み</span>
        </div>
      </div>

      <div className="strategic-grid">
        {intelligence.signals.map((signal) => (
          <div className="signal-card" key={signal.label}>
            <div className="signal-top">
              <span className="small">{signal.label}</span>
              <span className={`pill ${signal.value >= 80 ? "good" : signal.value >= 60 ? "warn" : "bad"}`}>{Math.round(signal.value)}</span>
            </div>
            <div className="bar"><span style={{ width: `${Math.round(signal.value)}%` }} /></div>
            <p className="note">{signal.note}</p>
          </div>
        ))}
      </div>

      <div className="strategic-summary">
        <div className="scenario">{intelligence.recommendation}</div>
        <div className="small">注意: 沖縄県内の基地外居住者数、市町村別実数、部隊移転完了時期は完全確定値ではなく、公開情報にもとづく商圏推計です。</div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>分析軸</th>
              <th>方向</th>
              <th>基準スコア</th>
              <th>価格心理</th>
              <th>根拠</th>
              <th>参照</th>
            </tr>
          </thead>
          <tbody>
            {intelligence.factors.map((factor) => (
              <tr key={factor.id}>
                <td>
                  <strong>{factor.label}</strong>
                  <div className="small">{factor.category}</div>
                </td>
                <td><span className={`pill ${factor.direction === "需要押上げ" ? "good" : factor.direction === "慎重化" ? "bad" : "warn"}`}>{factor.direction}</span></td>
                <td><span className={`pill ${pillTone(factor.baseScore)}`}>{factor.baseScore}</span></td>
                <td>{factor.pricePsychology}<div className="small">影響: {factor.priceImpact >= 0 ? "+" : ""}{factor.priceImpact.toFixed(1)}%</div></td>
                <td>{factor.rationale}</td>
                <td>
                  {factor.sources.map((source) => (
                    <div key={source.url}>
                      <span className="small">[{sourceLabel(source.kind)}] </span>
                      <a href={source.url} target="_blank" rel="noreferrer">{source.label}</a>
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
