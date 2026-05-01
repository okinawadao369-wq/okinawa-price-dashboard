export function SourcesPanel() {
  const sources = [
    "FRED API: DEXJPUS, CPIAUCSL, CPILFESL, CUSR0000SEFV, APU000074714, APU0000708111, UNRATE, CES0500000003, FEDFUNDS, DGS10, UMCSENT",
    "GDELT DOC 2.0 API: 国際ニュース記事数、リスク語、ポジティブ語による簡易スコア",
    "USFJ/Kadena公式公開情報: 在日米軍・沖縄米軍コミュニティ規模の参考",
    "DFAS/DTMO/DeCA/BLS/EIA/Care.com/UrbanSitter/米国公開価格: 所得、手当、生活費、サービス価格の参照",
    "沖縄県内の基地外居住者数・市町村別実売価格は公開統計で確定できないため、商圏推計モデルとして扱う"
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
        {sources.map((source) => <li key={source}>{source}</li>)}
      </ol>
    </section>
  );
}
