import { useState } from "react";
import { Area, Industry, Segment } from "../data/baseData";
import { calculatePurchaseScore, recommendedRange, verdict, yen } from "../utils/pricingEngine";

export function IndustryTable({ industries, segment, area, fx, cpiYoY, geoRisk, marketTemperature }: { industries: Industry[]; segment: Segment; area: Area; fx: number; cpiYoY: number; geoRisk: number; marketTemperature: number }) {
  const groups = ["全部", ...Array.from(new Set(industries.map((item) => item.group)))];
  const [group, setGroup] = useState("全部");
  const rows = group === "全部" ? industries : industries.filter((item) => item.group === group);

  return (
    <section className="card print-light">
      <h2>8. 業種別：米国単価 → 沖縄有効価格帯</h2>
      <div className="actions" style={{ marginBottom: 12 }}>
        {groups.map((g) => (
          <button key={g} className={g === group ? "" : "secondary"} onClick={() => setGroup(g)}>{g}</button>
        ))}
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>業種</th><th>米国単価</th><th>沖縄現行</th><th>推奨価格帯</th><th>スコア</th><th>判定</th><th>用途</th></tr>
          </thead>
          <tbody>
            {rows.map((item) => {
              const range = recommendedRange(item, fx, cpiYoY, geoRisk);
              const score = calculatePurchaseScore({ item, segment, area, priceJPY: item.okinawaCurrent, fx, marketTemperature });
              const tone = item.okinawaCurrent < range[0] ? "good" : item.okinawaCurrent <= range[1] ? "warn" : "bad";
              const label = item.okinawaCurrent < range[0] ? "値上げ余地" : item.okinawaCurrent <= range[1] ? "適正帯" : "高め";
              return (
                <tr key={item.id}>
                  <td><strong>{item.industry}</strong><br /><span className="small">{item.group} / {item.comment}</span></td>
                  <td>${item.usLow}〜${item.usHigh}<br /><span className="small">{item.unit}</span></td>
                  <td>{yen(item.okinawaCurrent)}<br /><span className="small">${Math.round(item.okinawaCurrent / fx)}</span></td>
                  <td><strong>{yen(range[0])}〜{yen(range[1])}</strong></td>
                  <td><span className={`pill ${score >= 80 ? "good" : score >= 60 ? "warn" : "bad"}`}>{Math.round(score)}</span></td>
                  <td><span className={`pill ${tone}`}>{label}</span><br /><span className="small">{verdict(score)}</span></td>
                  <td>{item.frequency}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
