import { FredPoint, fredValue, fredYoY } from "../utils/fredClient";
import { NewsArticle, TopicScore, aggregateNews } from "../utils/gdeltClient";

export function DailyMemoPanel({ fredData, newsScores, marketTemperature }: { fredData: FredPoint[]; newsScores: TopicScore[]; marketTemperature: number }) {
  const news = aggregateNews(newsScores);
  const fx = fredValue(fredData, "DEXJPUS", 156);
  const cpi = fredYoY(fredData, "CPIAUCSL", 3.1);
  const stress = news.consumerStress;
  const memo = `【自動分析メモ】
地政学リスク：${Math.round(news.geoRisk)} / 東アジア緊張：${Math.round(news.eastAsiaTension)} / 米軍前方展開：${Math.round(news.forwardPosture)} / 沖縄基地関連：${Math.round(news.okinawaBase)} / 米国消費ストレス：${Math.round(stress)}
USD/JPY=${fx.toFixed(1)}、CPI YoY=${cpi.toFixed(1)}%、購買市場温度=${marketTemperature}。

${news.geoRisk >= 70 ? "地政学ニュース量が多く、沖縄の前方展開価値・基地経済の継続性は高く見積もられます。ただし広告表現は政治色を避け、家族・安心・英語対応に寄せるべきです。" : "地政学ニュースは落ち着いた水準です。価格訴求だけでなく、通常の家族サービス・記念体験・英語予約の利便性で販売しやすい環境です。"}
${cpi >= 3.5 ? "米国物価ストレスが高いため、ドル換算表示と米国相場比較を入れると割安感が強まります。" : "米国インフレ圧力は相対的に落ち着いており、価格より品質・レビュー・予約の簡単さで差別化できます。"}`;

  return (
    <section className="card print-light">
      <h2>3. 今日の自動分析メモ</h2>
      <div className="console">{memo}</div>
    </section>
  );
}

export function NewsArticlePanel({ scores }: { scores: TopicScore[] }) {
  const [first] = scores;
  const ranked = [...scores].sort((a, b) => b.score - a.score);
  const topic = ranked[0] ?? first;
  const articles: NewsArticle[] = topic?.articles ?? [];

  return (
    <section className="card print-light">
      <h2>5. ニュース記事リスト</h2>
      <div className="kpi-line">
        <span className="small">表示トピック</span>
        <span className="pill info">{topic?.label ?? "未取得"}</span>
      </div>
      <div style={{ marginTop: 10 }}>
        {articles.length ? articles.slice(0, 10).map((article) => (
          <div className="article" key={article.url}>
            <a href={article.url} target="_blank" rel="noreferrer">{article.title || article.url}</a>
            <div className="small">{article.domain ?? ""} / {article.seendate ?? ""}</div>
          </div>
        )) : <p className="note">記事が未取得です。更新ボタンを押すとGDELTから取得します。通信失敗時はfallbackスコアを表示します。</p>}
      </div>
    </section>
  );
}
