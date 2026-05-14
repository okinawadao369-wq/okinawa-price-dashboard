import { monitoringSources } from "../data/monitoringSources";
import type { computeMarketDataOps } from "../utils/marketIntelligenceEngine";

type MarketDataOps = ReturnType<typeof computeMarketDataOps>;

const tone = (value: number) => value >= 80 ? "good" : value >= 60 ? "warn" : "bad";

export function MarketDataOpsPanel({ ops }: { ops: MarketDataOps }) {
  return (
    <section className="card print-light data-ops-panel">
      <div className="strategic-head">
        <div>
          <h2>自動監視データ収集・米国ミクロ価格インテリジェンス</h2>
          <p className="scenario">
            米政府、FRB/FRED、BLS、BEA、EIA、Treasury、国際機関、報道、市場、企業価格ニュースを、取得可能性とデータ品質を分けて数値化します。
            企業個別価格やライセンス性の強い市場データは、推計または手動確認として明示します。
          </p>
        </div>
        <div className="impact-card">
          <span className="small">品質カウント</span>
          <strong>{ops.qualityCounts.observed}/{ops.qualityCounts.estimated}</strong>
          <span className="small">observed / estimated</span>
        </div>
      </div>

      <div className="strategic-grid">
        {ops.pulses.map((pulse) => (
          <div className="signal-card" key={pulse.label}>
            <div className="signal-top">
              <span className="small">{pulse.label}</span>
              <span className={`pill ${tone(pulse.value)}`}>{Math.round(pulse.value)}</span>
            </div>
            <div className="bar"><span style={{ width: `${Math.round(pulse.value)}%` }} /></div>
            <p className="note">{pulse.note}</p>
            <span className="pill info">{pulse.quality}</span>
          </div>
        ))}
      </div>

      <div className="strategic-summary">
        <div className="scenario">{ops.dailyUpdateText}</div>
        <div className="small">
          データ品質: observed={ops.qualityCounts.observed} / estimated={ops.qualityCounts.estimated} / fallback={ops.qualityCounts.fallback} / unknown={ops.qualityCounts.unknown}
        </div>
      </div>

      <div className="grid-2">
        <div className="table-wrap">
          <h3>企業分野別 価格圧力</h3>
          <table>
            <thead>
              <tr>
                <th>分野</th>
                <th>圧力</th>
                <th>値上げ余地</th>
                <th>更新</th>
                <th>反映先</th>
              </tr>
            </thead>
            <tbody>
              {ops.sectorPulses.map((sector) => (
                <tr key={sector.sector}>
                  <td><strong>{sector.sector}</strong><div className="small">{sector.observedSignal}</div></td>
                  <td><span className={`pill ${tone(sector.pressure)}`}>{Math.round(sector.pressure)}</span></td>
                  <td>{sector.upsideRoom >= 0 ? "+" : ""}{(sector.upsideRoom * 100).toFixed(0)}%</td>
                  <td><span className="pill info">{sector.quality}</span><div className="small">{sector.updateCadence}</div></td>
                  <td>{sector.dashboardUse}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-wrap">
          <h3>監視対象ソース</h3>
          <table>
            <thead>
              <tr>
                <th>機関/媒体</th>
                <th>方式</th>
                <th>品質</th>
                <th>用途</th>
              </tr>
            </thead>
            <tbody>
              {monitoringSources.map((source) => (
                <tr key={source.id}>
                  <td>
                    <strong>{source.category}</strong>
                    <div><a href={source.url} target="_blank" rel="noreferrer">{source.source}</a></div>
                    <div className="small">{source.updateCadence}</div>
                  </td>
                  <td><span className="pill info">{source.status}</span></td>
                  <td><span className={`pill ${source.quality === "observed" ? "good" : source.quality === "estimated" ? "warn" : "bad"}`}>{source.quality}</span></td>
                  <td>{source.dashboardUse}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
