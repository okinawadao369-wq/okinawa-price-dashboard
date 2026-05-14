import type { ExchangeRatePoint } from "../utils/exchangeRateClient";

export function LiveFxPanel({ fxRate, fredFx }: { fxRate: ExchangeRatePoint; fredFx: number }) {
  const warnLine = 155;
  const crisisLine = 165;
  const pct = (value: number) => `${Math.max(4, Math.min(100, (value / crisisLine) * 100)).toFixed(1)}%`;
  const fetchedAt = new Date(fxRate.fetchedAt).toLocaleString("ja-JP");

  return (
    <section className="card print-light live-fx-panel">
      <div className="live-fx-main">
        <div className="label">最新為替レート</div>
        <div className="value">USD/JPY {fxRate.value.toFixed(2)}</div>
        <div className={`pill ${fxRate.quality === "observed" ? "good" : "warn"}`}>
          {fxRate.quality === "observed" ? "ライブ取得" : "キャッシュ/代替値"}
        </div>
        <p className="note">
          {fxRate.source} / 観測 {fxRate.observedAt} / 取得 {fetchedAt}
        </p>
      </div>
      <div className="fx-bars" aria-label="USD/JPY比較バー">
        <FxBar label="最新FX" value={fxRate.value} width={pct(fxRate.value)} tone="info" />
        <FxBar label="FRED/手入力" value={fredFx} width={pct(fredFx)} tone="good" />
        <FxBar label="警戒線" value={warnLine} width={pct(warnLine)} tone="warn" />
        <FxBar label="危機線" value={crisisLine} width={pct(crisisLine)} tone="bad" />
      </div>
    </section>
  );
}

function FxBar({ label, value, width, tone }: { label: string; value: number; width: string; tone: "good" | "warn" | "bad" | "info" }) {
  return (
    <div className="fx-bar-row">
      <span>{label}</span>
      <div className="fx-track"><i className={tone} style={{ width }} /></div>
      <b>{value.toFixed(2)}</b>
    </div>
  );
}
