import { Activity, Database, Home, Newspaper, RefreshCw, TrendingUp } from "lucide-react";
import type { FredPoint } from "../utils/fredClient";
import type { TopicScore } from "../utils/gdeltClient";
import type { ExchangeRatePoint } from "../utils/exchangeRateClient";
import type { RssIntelResult } from "../utils/rssIntelClient";

type SourceStatus = {
  fredLive: number;
  fredCache: number;
  fredFallback: number;
  fredTotal: number;
  gdeltLive: number;
  gdeltTotal: number;
  gdeltCache: number;
  gdeltFallback: number;
  rssLive?: number;
  rssTotal?: number;
};

function toneFromRatio(live: number, total: number) {
  if (total <= 0) return "bad";
  const ratio = live / total;
  if (ratio >= 0.9) return "good";
  if (ratio > 0) return "warn";
  return "bad";
}

function newestFredDate(data: FredPoint[]) {
  const dates = data
    .map((item) => item.date)
    .filter((date) => date && date !== "fallback")
    .sort()
    .reverse();
  return dates[0] ?? "fallback";
}

export function DataFlowHealthPanel({
  sourceStatus,
  fredData,
  newsScores,
  fxRate,
  rssIntel,
  housingBoost,
  finalPurchaseScore
}: {
  sourceStatus: SourceStatus;
  fredData: FredPoint[];
  newsScores: TopicScore[];
  fxRate: ExchangeRatePoint;
  rssIntel: RssIntelResult;
  housingBoost: number;
  finalPurchaseScore: number;
}) {
  const gdeltArticles = newsScores.reduce((sum, topic) => sum + topic.articleCount, 0);
  const rows = [
    {
      label: "FRED経済指標",
      status: `live ${sourceStatus.fredLive}/${sourceStatus.fredTotal}`,
      detail: `最新日付 ${newestFredDate(fredData)}。CPI・雇用・賃金・金利を価格心理へ反映。`,
      tone: sourceStatus.fredLive === sourceStatus.fredTotal
        ? "good"
        : sourceStatus.fredLive + sourceStatus.fredCache === sourceStatus.fredTotal
          ? "warn"
          : "bad",
      icon: <Database size={18} />
    },
    {
      label: "USD/JPY為替",
      status: fxRate.quality === "observed" ? "live" : "fallback",
      detail: `${fxRate.value.toFixed(2)} JPY/USD。推奨価格帯・ドル換算・市場温度へ反映。`,
      tone: fxRate.quality === "observed" ? "good" : "warn",
      icon: <TrendingUp size={18} />
    },
    {
      label: "GDELTニュース",
      status: `${sourceStatus.gdeltLive}/${sourceStatus.gdeltTotal} live`,
      detail: `${gdeltArticles}件分類。取得不能時はcache/fallbackとして明示し、RSSで補完。`,
      tone: sourceStatus.gdeltLive === sourceStatus.gdeltTotal
        ? "good"
        : sourceStatus.gdeltLive + sourceStatus.gdeltCache > 0
          ? "warn"
          : "bad",
      icon: <Newspaper size={18} />
    },
    {
      label: "公式RSS・メディア補完",
      status: `${rssIntel.liveCount}/${rssIntel.total} live`,
      detail: `FRB・DoD/War.gov・Al Jazeera等。現在リスクスコア ${rssIntel.riskScore}。`,
      tone: toneFromRatio(rssIntel.liveCount, rssIntel.total),
      icon: <RefreshCw size={18} />
    },
    {
      label: "住宅心理/OHA",
      status: `boost x${housingBoost.toFixed(2)}`,
      detail: "住宅満足度・OHA枠・面積適合を購買意欲スコアへ補正済み。",
      tone: housingBoost >= 1.04 ? "good" : housingBoost >= 0.98 ? "warn" : "bad",
      icon: <Home size={18} />
    },
    {
      label: "価格心理シミュレーター",
      status: `final ${Math.round(finalPurchaseScore)}`,
      detail: "米国単価補正、為替、CPI、地政学/RSS、エリア、セグメント、住宅ブーストを統合。",
      tone: finalPurchaseScore >= 80 ? "good" : finalPurchaseScore >= 60 ? "warn" : "bad",
      icon: <Activity size={18} />
    }
  ];

  return (
    <section className="card print-light">
      <h2>データ収集・反映ヘルスチェック</h2>
      <p className="note">
        各部門の取得状態と、価格心理シミュレーターへの反映経路を確認します。live以外はキャッシュ・推計・フォールバックとして扱い、数値判断の信頼度を下げて表示します。
      </p>
      <div className="health-grid">
        {rows.map((row) => (
          <div className={`health-card health-${row.tone}`} key={row.label}>
            <div className="health-head">
              <span>{row.icon}</span>
              <strong>{row.label}</strong>
              <span className={`pill ${row.tone}`}>{row.status}</span>
            </div>
            <p>{row.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
