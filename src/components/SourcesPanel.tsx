export function SourcesPanel() {
  const sources = [
    { label: "FRED API: DEXJPUS, CPI, 雇用, 賃金, 金利, 消費者心理", url: "https://fred.stlouisfed.org/" },
    { label: "GDELT DOC 2.0 API: 国際ニュース記事数、リスク語、ポジティブ語による簡易スコア", url: "https://blog.gdeltproject.org/gdelt-doc-2-0-api-debuts/" },
    { label: "U.S. DoD: USFJ統合司令部化と日米2+2", url: "https://www.defense.gov/News/News-Stories/Article/Article/3852213/us-intends-to-reconstitute-us-forces-japan-as-joint-forces-headquarters/" },
    { label: "12th Marine Littoral Regiment: 沖縄の前方展開・MLR機能", url: "https://www.12thmlr.marines.mil/" },
    { label: "Japan MOD: 沖縄からグアムへのForce Flow開始", url: "https://www.mod.go.jp/en/article/2024/12/6c46940d514c2bf54e7c946d49f5552e5730c31f.html" },
    { label: "Al Jazeera Asia: 国際政治・戦争・アジア情勢モニタリング", url: "https://www.aljazeera.com/asia/" },
    { label: "Bloomberg Currencies: 為替市場・円安/介入警戒の参照", url: "https://www.bloomberg.com/jp/markets/currencies" },
    { label: "DFAS/DTMO/DeCA/BLS/EIA/Care.com/UrbanSitter/米国公開価格: 所得、手当、生活費、サービス価格の参照", url: "https://www.dfas.mil/MilitaryMembers/payentitlements/Pay-Tables/" }
  ];
  return (
    <section className="card print-light">
      <h2>9. 注意書き・参照ソース</h2>
      <p className="scenario" style={{ border: "1px solid rgba(245,158,11,.35)", borderRadius: 14, padding: 12, background: "rgba(245,158,11,.08)" }}>
        本ダッシュボードは、公開資料・APIデータ・ニュース検索・推計モデルを用いたマーケティング意思決定支援ツールです。沖縄県内の基地外居住者数や業種別実売価格を完全に確定するものではありません。
      </p>
      <p className="scenario" style={{ border: "1px solid rgba(56,189,248,.35)", borderRadius: 14, padding: 12, background: "rgba(56,189,248,.08)" }}>
        FRED APIキーをフロントエンドに埋め込む場合、外部公開は非推奨です。公開運用する場合はバックエンドプロキシを利用してください。
      </p>
      <ol className="source-list">
        {sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label}</a></li>)}
      </ol>
      <p className="note">沖縄県内の基地外居住者数・市町村別実売価格は公開統計で確定できないため、商圏推計モデルとして扱います。</p>
    </section>
  );
}
