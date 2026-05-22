import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ReactElement } from "react";
import { okinawaOhaRankBudgets, usBahBudgets } from "../data/housingData";
import { calculateSizeFitScore } from "../utils/housingPsychologyEngine";

const rentCompare = [
  { market: "Okinawa", rentJpy: 300000, tsuboUnit: 8000 },
  { market: "Yokosuka", rentJpy: 210000, tsuboUnit: 9100 },
  { market: "San Diego", rentJpy: 566600, tsuboUnit: 13800 },
  { market: "Camp Pendleton", rentJpy: 627000, tsuboUnit: 13000 }
];

const bahCompare = [
  { label: "Okinawa E5/O1/O2", usd: okinawaOhaRankBudgets[1].rentAllowanceUsd },
  { label: "Okinawa E6/O3", usd: okinawaOhaRankBudgets[2].rentAllowanceUsd },
  { label: "San Diego E5", usd: usBahBudgets[0].e5WithDependents },
  { label: "San Diego O3", usd: usBahBudgets[0].o3WithDependents },
  { label: "Pendleton E5", usd: usBahBudgets[1].e5WithDependents },
  { label: "Pendleton O3", usd: usBahBudgets[1].o3WithDependents }
];

const sizeFit = [100, 120, 140, 160, 180].map((sqm) => ({
  sqm,
  score: calculateSizeFitScore({ actualSqm: sqm, standardSqm: 151 })
}));

export function HousingCharts() {
  return (
    <section className="grid-2">
      <ChartCard title="地域別家賃比較">
        <BarChart data={rentCompare}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="market" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Legend />
          <Bar dataKey="rentJpy" name="家賃円" fill="#38bdf8" />
        </BarChart>
      </ChartCard>
      <ChartCard title="地域別坪単価比較">
        <BarChart data={rentCompare}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="market" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Legend />
          <Bar dataKey="tsuboUnit" name="円/坪" fill="#a78bfa" />
        </BarChart>
      </ChartCard>
      <ChartCard title="ランク別OHA/BAH比較">
        <BarChart data={bahCompare}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="label" stroke="#94a3b8" interval={0} angle={-16} textAnchor="end" height={70} />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Legend />
          <Bar dataKey="usd" name="USD/月" fill="#22c55e" />
        </BarChart>
      </ChartCard>
      <ChartCard title="面積適合スコア">
        <BarChart data={sizeFit}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="sqm" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <Bar dataKey="score" name="151㎡基準の適合" fill="#f59e0b" />
        </BarChart>
      </ChartCard>
    </section>
  );
}

function ChartCard({ title, children }: { title: string; children: ReactElement }) {
  return (
    <section className="card print-light">
      <h2>{title}</h2>
      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer>{children}</ResponsiveContainer>
      </div>
    </section>
  );
}
