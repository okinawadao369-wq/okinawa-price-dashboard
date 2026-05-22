import { ArrowUpRight, Home, LineChart, ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";

function scoreTone(score: number) {
  if (score >= 80) return "good";
  if (score >= 60) return "warn";
  return "bad";
}

function judgment(score: number) {
  if (score >= 84) return "値上げ余地あり";
  if (score >= 70) return "適正から強い";
  if (score >= 58) return "説明強化が必要";
  return "価格再設計";
}

export function MobileExecutiveSummary({
  fx,
  geoRisk,
  marketTemperature,
  finalPurchaseScore,
  basePurchaseScore,
  housingPsychologyScore,
  housingBoost
}: {
  fx: number;
  geoRisk: number;
  marketTemperature: number;
  finalPurchaseScore: number;
  basePurchaseScore: number;
  housingPsychologyScore: number;
  housingBoost: number;
}) {
  const finalTone = scoreTone(finalPurchaseScore);
  return (
    <section className="mobile-exec-summary print-light" aria-label="スマホ用経営サマリー">
      <div className="mobile-exec-hero">
        <div>
          <span className="eyebrow mobile-eyebrow">
            <LineChart size={16} />
            外出先確認モード
          </span>
          <h2>今日の価格判断</h2>
          <p>{judgment(finalPurchaseScore)}</p>
        </div>
        <div className={`mobile-score ${finalTone}`}>{Math.round(finalPurchaseScore)}</div>
      </div>

      <div className="mobile-exec-grid">
        <MiniMetric
          icon={<ArrowUpRight size={17} />}
          label="購買温度"
          value={Math.round(marketTemperature).toString()}
          tone={scoreTone(marketTemperature)}
        />
        <MiniMetric
          icon={<Home size={17} />}
          label="住宅心理"
          value={`${Math.round(housingPsychologyScore)}`}
          tone={scoreTone(housingPsychologyScore)}
        />
        <MiniMetric
          icon={<ShieldAlert size={17} />}
          label="地政学"
          value={Math.round(geoRisk).toString()}
          tone={scoreTone(geoRisk)}
        />
        <MiniMetric
          icon={<LineChart size={17} />}
          label="USD/JPY"
          value={fx.toFixed(1)}
          tone="info"
        />
      </div>

      <div className="mobile-exec-note">
        Base {Math.round(basePurchaseScore)} → Housing x{housingBoost.toFixed(2)} → Final {Math.round(finalPurchaseScore)}
      </div>
    </section>
  );
}

function MiniMetric({
  icon,
  label,
  value,
  tone
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone: "good" | "warn" | "bad" | "info";
}) {
  return (
    <div className={`mobile-mini metric-${tone}`}>
      <div className="mobile-mini-label">
        {icon}
        <span>{label}</span>
      </div>
      <strong>{value}</strong>
    </div>
  );
}
