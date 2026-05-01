import { Area } from "../data/baseData";

export function AreaMarketMap({ areas }: { areas: Area[] }) {
  return (
    <section className="card print-light">
      <h2>6. エリア別 米軍・軍属ターゲット商圏（推計モデル）</h2>
      <div className="area-list">
        {areas.map((a) => (
          <div key={a.area} className="area-card">
            <div className="area-name">
              <strong>{a.area}</strong>
            </div>
            <div className="area-bases">
              {a.bases}
            </div>
            <div className="area-market">
              <div className="bar"><span style={{ width: `${Math.min(100, Math.round(a.share * 190))}%` }} /></div>
              <div className="area-note">
                <span>推定商圏比率：{Math.round(a.share * 100)}%</span>
                <span>{a.note}</span>
              </div>
            </div>
            <div className="area-score">
              <span className={`pill ${a.affinity >= 85 ? "good" : a.affinity >= 70 ? "warn" : "bad"}`}>{a.affinity}</span>
              <span className="small">適合</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
