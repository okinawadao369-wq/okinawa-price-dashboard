type Kpi = { label: string; value: string; sub: string; tone?: "good" | "warn" | "bad" | "info" };

function toneFor(score?: number): Kpi["tone"] {
  if (score === undefined) return "info";
  if (score >= 80) return "good";
  if (score >= 60) return "warn";
  return "bad";
}

export function KpiCards({ fx, cpiYoY, geoRisk, marketTemperature }: { fx: number; cpiYoY: number; geoRisk: number; marketTemperature: number }) {
  const cards: Kpi[] = [
    { label: "沖縄米軍コミュニティ", value: "~80,000", sub: "Kadena公表値ベースの市場母数", tone: "info" },
    { label: "USD/JPY", value: fx.toFixed(1), sub: "FRED DEXJPUS / 手入力対応", tone: "info" },
    { label: "米国CPI YoY", value: `${cpiYoY.toFixed(1)}%`, sub: "CPIAUCSLからYoY自動計算", tone: cpiYoY >= 3.5 ? "warn" : "good" },
    { label: "地政学リスク", value: `${Math.round(geoRisk)}`, sub: "GDELT記事量・リスク語で算出", tone: toneFor(geoRisk) },
    { label: "購買市場温度", value: `${Math.round(marketTemperature)}`, sub: "為替・物価・雇用・基地関連を合成", tone: toneFor(marketTemperature) }
  ];

  return (
    <section className="grid-5">
      {cards.map((card) => (
        <div key={card.label} className="card metric print-light">
          <div className="label">{card.label}</div>
          <div className="value">{card.value}</div>
          <div className={`pill ${card.tone ?? "info"}`} style={{ marginTop: 10 }}>
            {card.tone === "good" ? "strong" : card.tone === "warn" ? "watch" : card.tone === "bad" ? "risk" : "model"}
          </div>
          <div className="sub">{card.sub}</div>
        </div>
      ))}
    </section>
  );
}
