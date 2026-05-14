import { RefreshCw } from "lucide-react";

export function UpdateControls(props: {
  autoUpdate: boolean;
  setAutoUpdate: (value: boolean) => void;
  timespan: string;
  setTimespan: (value: string) => void;
  onRefresh: () => void;
  loading: boolean;
  logs: string[];
  fredInlineKey: string;
  setFredInlineKey: (value: string) => void;
  sourceStatus: {
    label: string;
    detail: string;
    tone: "good" | "warn" | "bad";
    fredLive: number;
    fredTotal: number;
    gdeltLive: number;
    gdeltTotal: number;
    gdeltCache: number;
    gdeltFallback: number;
    gdeltRetryUntil?: string;
  };
}) {
  const status = props.sourceStatus;
  const retryUntil = status.gdeltRetryUntil ? new Date(status.gdeltRetryUntil).toLocaleString("ja-JP") : null;

  return (
    <section className="card print-light">
      <h2>自動更新コントロール</h2>
      {status.tone !== "good" && (
        <div className={`source-alert ${status.tone}`}>
          <strong>{status.label}</strong>
          <span>{status.detail}</span>
          {retryUntil && <span>GDELT再試行目安: {retryUntil}</span>}
        </div>
      )}

      <div className="grid-3">
        <div>
          <label className="field-label">自動更新</label>
          <select value={props.autoUpdate ? "on" : "off"} onChange={(e) => props.setAutoUpdate(e.target.value === "on")}>
            <option value="on">ON：開いた時に更新</option>
            <option value="off">OFF：手動のみ</option>
          </select>
        </div>
        <div>
          <label className="field-label">ニュース検索期間</label>
          <select value={props.timespan} onChange={(e) => props.setTimespan(e.target.value)}>
            <option value="1d">直近24時間</option>
            <option value="2d">直近2日</option>
            <option value="3d">直近3日</option>
            <option value="7d">直近7日</option>
          </select>
        </div>
        <div style={{ alignSelf: "end" }}>
          <button onClick={props.onRefresh} disabled={props.loading} style={{ width: "100%" }}>
            <RefreshCw size={16} style={{ verticalAlign: "-3px", marginRight: 8 }} />
            FRED + GDELTを更新
          </button>
        </div>
      </div>

      <div className="source-quality">
        <span className="pill good">FRED live {status.fredLive}/{status.fredTotal}</span>
        <span className={status.gdeltLive ? "pill good" : "pill warn"}>GDELT live {status.gdeltLive}/{status.gdeltTotal}</span>
        <span className="pill warn">cache {status.gdeltCache}</span>
        <span className={status.gdeltFallback ? "pill bad" : "pill info"}>fallback {status.gdeltFallback}</span>
      </div>

      <div style={{ marginTop: 14 }}>
        <label className="field-label">ローカル管理用 FRED APIキー直接入力</label>
        <input
          placeholder="公開URLでは入力しない。ローカル検証時のみ入力"
          value={props.fredInlineKey}
          onChange={(e) => props.setFredInlineKey(e.target.value)}
        />
      </div>
      <p className="note">
        公開Vercel運用ではFRED APIキーをブラウザに入れないでください。APIキーはVercel環境変数に置き、/api/fred のサーバー側プロキシ経由で取得します。
        GDELTが502/レート制限の場合、スコアはcache/fallback由来として表示します。
      </p>
      <div className="console" style={{ marginTop: 12 }}>
        {props.logs.length ? props.logs.map((log, i) => <div key={`${log}-${i}`}>{log}</div>) : "準備完了。更新ログはここに表示されます。"}
      </div>
    </section>
  );
}
