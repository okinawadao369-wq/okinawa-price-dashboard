import { okinawaOhaRankBudgets } from "../data/housingData";
import { yen, usd } from "../utils/pricingEngine";

export function RankHousingBudgetTable() {
  return (
    <section className="card print-light">
      <h2>住宅制度 1. ランク別OHA住宅予算モデル</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ランク</th>
              <th>OHA家賃枠</th>
              <th>住宅予算</th>
              <th>想定面積</th>
              <th>想定坪数</th>
              <th>推奨家賃</th>
              <th>住宅心理 / 消費余力</th>
            </tr>
          </thead>
          <tbody>
            {okinawaOhaRankBudgets.map((budget) => (
              <tr key={budget.id}>
                <td><strong>{budget.label}</strong></td>
                <td>{usd(budget.rentAllowanceUsd)}<br /><span className="small">{yen(budget.rentAllowanceJpy)}</span></td>
                <td>{usd(budget.totalHousingBudgetUsd)}<br /><span className="small">{yen(budget.totalHousingBudgetJpy)} 光熱込みモデル</span></td>
                <td>{budget.targetSqmRange[0]}〜{budget.targetSqmRange[1]}㎡</td>
                <td>{budget.targetTsuboRange[0]}〜{budget.targetTsuboRange[1]}坪</td>
                <td>{yen(budget.practicalRentJpyRange[0])}〜{yen(budget.practicalRentJpyRange[1])}</td>
                <td>{budget.psychology}<br /><span className="small">OHA内で住宅満足が高いほど、妊婦ケア・写真・飲食・シッター支出が残りやすい推計。</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
