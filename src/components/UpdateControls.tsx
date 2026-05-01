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
}) {
  return (
    <section className="card print-light">
      <h2>自動更新コントロール</h2>
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
      <div style={{ marginTop: 14 }}>
        <label className="field-label">ローカル管理用 FRED APIキー直接入力</label>
        <input placeholder="VITE_FRED_API_KEY未設定時だけここに入力" value={props.fredInlineKey} onChange={(e) => props.setFredInlineKey(e.target.value)} />
      </div>
      <p className="note">
        FRED APIキーをフロントエンドに埋め込む場合、外部公開は非推奨です。公開運用する場合はバックエンドプロキシを利用してください。
      </p>
      <div className="console" style={{ marginTop: 12 }}>
        {props.logs.length ? props.logs.map((log, i) => <div key={`${log}-${i}`}>{log}</div>) : "準備完了。更新ログはここに表示されます。"}
      </div>
    </section>
  );
}
