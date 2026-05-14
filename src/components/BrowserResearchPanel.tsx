import { browserResearchSources } from "../data/browserResearchSources";
import type { RssIntelResult } from "../utils/rssIntelClient";

const methodLabel = {
  official_api: "公式API",
  official_rss: "公式RSS",
  gdelt_search: "GDELT検索",
  licensed_manual: "手動/ライセンス",
  model_estimate: "推計モデル"
};

const qualityTone = (quality: string) => quality === "observed" ? "good" : quality === "estimated" ? "warn" : "bad";
const scoreTone = (value: number) => value >= 80 ? "good" : value >= 60 ? "warn" : "bad";

export function BrowserResearchPanel({ rssIntel }: { rssIntel: RssIntelResult }) {
  const autoCount = browserResearchSources.filter((source) => source.canAutoCollect).length;
  const observedCount = browserResearchSources.filter((source) => source.quality === "observed").length;

  return (
    <section className="card print-light browser-research-panel">
      <div className="strategic-head">
        <div>
          <h2>ブラウジング調査・自動データ収集検証</h2>
          <p className="scenario">
            ブラウザ閲覧だけに依存せず、公式API・公式RSS・GDELT検索を優先して毎日更新できる形に変換します。
            Bloomberg/TradingViewや企業別価格のようにライセンス・規約・地域差が大きい情報は、手動確認または推計モデルとして明示します。
          </p>
        </div>
        <div className="impact-card">
          <span className="small">自動化可能</span>
          <strong>{autoCount}/{browserResearchSources.length}</strong>
          <span className="small">observed {observedCount}</span>
        </div>
      </div>

      <div className="strategic-grid">
        <div className="signal-card">
          <div className="signal-top">
            <span className="small">RSS/ブラウジング実行</span>
            <span className={`pill ${rssIntel.liveCount === rssIntel.total ? "good" : rssIntel.liveCount ? "warn" : "bad"}`}>live {rssIntel.liveCount}/{rssIntel.total}</span>
          </div>
          <div className="bar"><span style={{ width: `${Math.round((rssIntel.liveCount / Math.max(rssIntel.total, 1)) * 100)}%` }} /></div>
          <p className="note">FRB RSS、Al Jazeera RSSなどの見出しをサーバー側で取得し、リスク語・ポジティブ語で採点します。</p>
        </div>
        <div className="signal-card">
          <div className="signal-top">
            <span className="small">RSSリスク補助スコア</span>
            <span className={`pill ${scoreTone(rssIntel.riskScore)}`}>{rssIntel.riskScore}</span>
          </div>
          <div className="bar"><span style={{ width: `${rssIntel.riskScore}%` }} /></div>
          <p className="note">GDELTがレート制限の時も、RSS系の補助シグナルでニュース温度を確認できます。</p>
        </div>
      </div>

      <div className="grid-2">
        <div className="table-wrap">
          <h3>実行済みRSS/ブラウジング結果</h3>
          <table>
            <thead>
              <tr>
                <th>ソース</th>
                <th>状態</th>
                <th>件数</th>
                <th>スコア</th>
                <th>最新見出し</th>
              </tr>
            </thead>
            <tbody>
              {rssIntel.sources.length ? rssIntel.sources.map((source) => (
                <tr key={source.id}>
                  <td><strong>{source.label}</strong><div className="small">{source.url}</div></td>
                  <td><span className={`pill ${source.status === "live" ? "good" : "bad"}`}>{source.status}</span></td>
                  <td>{source.articleCount}</td>
                  <td><span className={`pill ${scoreTone(source.score)}`}>{source.score}</span></td>
                  <td>{source.items[0] ? <a href={source.items[0].link} target="_blank" rel="noreferrer">{source.items[0].title}</a> : <span className="small">{source.error ?? "未取得"}</span>}</td>
                </tr>
              )) : (
                <tr><td colSpan={5}>次回更新時にRSS/ブラウジング検証結果を表示します。</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-wrap">
          <h3>収集方法の検証表</h3>
          <table>
            <thead>
              <tr>
                <th>情報源</th>
                <th>方法</th>
                <th>品質</th>
                <th>反映先</th>
              </tr>
            </thead>
            <tbody>
              {browserResearchSources.map((source) => (
                <tr key={source.id}>
                  <td>
                    <strong>{source.name}</strong>
                    <div><a href={source.url.startsWith("manual://") ? "#" : source.url} target="_blank" rel="noreferrer">{source.url}</a></div>
                    <div className="small">{source.cadence}</div>
                  </td>
                  <td><span className={source.canAutoCollect ? "pill good" : "pill warn"}>{methodLabel[source.method]}</span></td>
                  <td><span className={`pill ${qualityTone(source.quality)}`}>{source.quality}</span></td>
                  <td>{source.dashboardMetric}<div className="small">{source.note}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
