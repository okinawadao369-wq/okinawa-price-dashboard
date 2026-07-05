import type { Industry } from "../data/baseData";
import { clamp } from "../utils/pricingEngine";

const yen = (value: number) => new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 }).format(value);
const usd = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: value < 20 ? 2 : 0 }).format(value);

function actionFor(item: Industry, currentUsd: number) {
  if (currentUsd < item.usLow) {
    if (item.id === "ft_sitter_med") return "Separate medical/postpartum price tier";
    if (item.id === "ft_4d") return "Create premium 4D family memory package";
    if (item.id === "ft_2d") return "Keep entry price, add keepsake upsell";
    return "Raise or bundle with English support";
  }
  if (currentUsd <= item.usHigh) return "Inside US anchor: sell trust and convenience";
  return "Above US anchor: strengthen proof, reviews, and inclusions";
}

export function PriceOpportunityPanel({ industries, fx }: { industries: Industry[]; fx: number }) {
  const rows = industries
    .map((item) => {
      const currentUsd = item.okinawaCurrent / fx;
      const anchorMid = (item.usLow + item.usHigh) / 2;
      const gapToLow = item.usLow - currentUsd;
      const gapToMidRatio = anchorMid > 0 ? (anchorMid - currentUsd) / anchorMid : 0;
      const familyTreePriority = ["ft_4d", "ft_sitter_med", "ft_2d", "baby_keepsake"].includes(item.id) ? 10 : 0;
      const opportunityScore = Math.round(clamp(gapToMidRatio * 72 + item.need * 18 + item.premium * 6 + familyTreePriority, 0, 100));
      const status = currentUsd < item.usLow ? "below" : currentUsd <= item.usHigh ? "inside" : "above";
      return { item, currentUsd, anchorMid, gapToLow, gapToMidRatio, opportunityScore, status };
    })
    .sort((a, b) => b.opportunityScore - a.opportunityScore)
    .slice(0, 8);

  const topFamilyTree = rows.find((row) => row.item.id.startsWith("ft_")) ?? rows[0];

  return (
    <section className="card price-opportunity-panel print-light">
      <div className="strategic-head">
        <div>
          <h2>US Anchor Opportunity Ranking</h2>
          <p className="scenario">
            Public U.S. price anchors are treated as estimated benchmarks, then adjusted by FRED/BLS wages, CPI, food-away inflation, FX, and news stress.
            This panel shows where Okinawa prices look meaningfully cheaper to U.S. military families.
          </p>
        </div>
        <div className="impact-card">
          <span className="small">FX used</span>
          <strong>{fx.toFixed(2)}</strong>
          <span className="small">JPY per USD</span>
        </div>
        <div className="impact-card">
          <span className="small">Top action</span>
          <strong>{topFamilyTree ? topFamilyTree.opportunityScore : 0}</strong>
          <span className="small">{topFamilyTree?.item.industry ?? "No data"}</span>
        </div>
      </div>

      <div className="opportunity-list">
        {rows.map(({ item, currentUsd, gapToLow, opportunityScore, status }) => (
          <article className="opportunity-row" key={item.id}>
            <div className="opportunity-main">
              <div>
                <strong>{item.industry}</strong>
                <div className="small">{item.group} / {item.usPriceQuality ?? "estimated"} / reviewed {item.usPriceLastReviewed ?? "unknown"}</div>
              </div>
              <span className={`pill ${status === "below" ? "good" : status === "inside" ? "warn" : "bad"}`}>
                {status === "below" ? "under US anchor" : status === "inside" ? "inside anchor" : "above anchor"}
              </span>
            </div>
            <div className="opportunity-metrics">
              <div>
                <span className="small">Okinawa</span>
                <strong>{yen(item.okinawaCurrent)} / {usd(currentUsd)}</strong>
              </div>
              <div>
                <span className="small">US anchor</span>
                <strong>{usd(item.usLow)} - {usd(item.usHigh)}</strong>
              </div>
              <div>
                <span className="small">Gap to low</span>
                <strong>{gapToLow > 0 ? usd(gapToLow) : usd(0)}</strong>
              </div>
              <div>
                <span className="small">Opportunity</span>
                <strong>{opportunityScore}</strong>
              </div>
            </div>
            <div className="opportunity-action">
              <span className="small">Recommended action</span>
              <strong>{actionFor(item, currentUsd)}</strong>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
