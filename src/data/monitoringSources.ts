export type DataSourceStatus = "自動API" | "ニュース検索" | "手動/ライセンス" | "推計モデル";
export type EvidenceQuality = "observed" | "estimated" | "fallback" | "unknown";

export type MonitoringSource = {
  id: string;
  category: string;
  source: string;
  url: string;
  updateCadence: string;
  status: DataSourceStatus;
  quality: EvidenceQuality;
  dashboardUse: string;
};

export type SectorPriceBenchmark = {
  id: string;
  sector: string;
  sourceFamily: string;
  observedSignal: string;
  updateCadence: string;
  quality: EvidenceQuality;
  dashboardUse: string;
};

export const monitoringSources: MonitoringSource[] = [
  { id: "fred", category: "FRB/FRED", source: "FRED API", url: "https://fred.stlouisfed.org/docs/api/fred/series_observations.html", updateCadence: "日次または系列ごと", status: "自動API", quality: "observed", dashboardUse: "USD/JPY、CPI、雇用、賃金、金利、消費者心理を市場温度へ反映" },
  { id: "gdelt", category: "国際ニュース", source: "GDELT DOC 2.0", url: "https://blog.gdeltproject.org/gdelt-doc-2-0-api-debuts/", updateCadence: "起動時または手動更新で1d/2d/3d/7d検索", status: "ニュース検索", quality: "observed", dashboardUse: "戦争、政治、基地、米国経済ニュースをスコア化。レート制限時はcache/fallbackを明示" },
  { id: "bls", category: "米政府/物価", source: "BLS Public Data API", url: "https://www.bls.gov/developers/api_signature_v2.htm", updateCadence: "月次/リリース時", status: "自動API", quality: "observed", dashboardUse: "CPI/PPI/雇用/賃金を企業分野別価格圧力へ接続" },
  { id: "bea", category: "米政府/景気", source: "BEA API", url: "https://www.bea.gov/tools", updateCadence: "月次/四半期", status: "自動API", quality: "observed", dashboardUse: "GDP、個人所得、個人消費支出から米国家計の余力を確認" },
  { id: "eia", category: "米政府/エネルギー", source: "EIA API", url: "https://www.eia.gov/opendata/documentation.php", updateCadence: "週次/一部日次", status: "自動API", quality: "observed", dashboardUse: "ガソリン、原油、電力コストを外食/移動/生活サービス価格へ反映" },
  { id: "treasury", category: "米政府/財政金融", source: "U.S. Treasury Fiscal Data API", url: "https://fiscaldata.treasury.gov/api-documentation/", updateCadence: "日次/月次", status: "自動API", quality: "observed", dashboardUse: "米財政、国債、利払い、為替参照を市場リスクへ反映" },
  { id: "usaspend", category: "米政府/支出", source: "USAspending API", url: "https://api.usaspending.gov/docs/", updateCadence: "日次/随時", status: "自動API", quality: "observed", dashboardUse: "国防・地域別支出の強弱を米軍関連需要の補助指標にする" },
  { id: "dod_budget", category: "米国防", source: "DoD Comptroller Budget Materials", url: "https://comptroller.defense.gov/Budget-Materials/Budget2026/", updateCadence: "予算発表/議会審議時", status: "ニュース検索", quality: "observed", dashboardUse: "国防予算、太平洋抑止、人件費の方向性を米軍商圏持続性へ反映" },
  { id: "worldbank", category: "国際機関", source: "World Bank Indicators API", url: "https://datahelpdesk.worldbank.org/knowledgebase/articles/889392-about-the-indicators-api-documentation", updateCadence: "月次/年次", status: "自動API", quality: "observed", dashboardUse: "世界経済、貿易、エネルギー、所得環境の背景指標" },
  { id: "media", category: "報道/市場", source: "Al Jazeera / Bloomberg / Reuters等", url: "https://www.aljazeera.com/asia/", updateCadence: "随時", status: "ニュース検索", quality: "estimated", dashboardUse: "速報性のある政治・戦争・為替・市場心理をGDELT検索で代理取得" },
  { id: "licensed_market", category: "市場/為替", source: "Bloomberg Currencies / TradingView", url: "https://www.bloomberg.com/jp/markets/currencies", updateCadence: "リアルタイム", status: "手動/ライセンス", quality: "estimated", dashboardUse: "表示・確認用。計算値は公開API、FRED、手入力USD/JPYを優先" }
];

export const sectorPriceBenchmarks: SectorPriceBenchmark[] = [
  { id: "restaurant", sector: "飲食・外食", sourceFamily: "BLS CPI Food Away From Home / GDELT企業価格ニュース", observedSignal: "外食CPI、賃金、ガソリン、企業値上げ報道", updateCadence: "月次+日次ニュース", quality: "observed", dashboardUse: "ラテ、ランチ、ファミリーディナー、記念日ディナーの推奨帯を補正" },
  { id: "childcare", sector: "ベビーシッター・産後ケア", sourceFamily: "Care.com / UrbanSitter / BLS賃金 / GDELT生活費ニュース", observedSignal: "公開相場は手動確認、日次は生活費ニュースで補正", updateCadence: "手動+日次ニュース", quality: "estimated", dashboardUse: "通常シッターと医療系産後ケアの価格差を明確化" },
  { id: "ultrasound", sector: "2D/4Dエコー・妊婦体験", sourceFamily: "米国公開価格 / FamilyTreeOki現行価格 / GDELT医療消費", observedSignal: "民間公開価格と米国相場アンカー", updateCadence: "月次手動+日次ニュース", quality: "estimated", dashboardUse: "FamilyTreeOkiの入口価格・上位パッケージ余地を算出" },
  { id: "beauty", sector: "美容・ウェルネス", sourceFamily: "BLS services / 公開価格 / GDELT消費ストレス", observedSignal: "サービス価格・賃金・米国家計心理", updateCadence: "月次+日次ニュース", quality: "estimated", dashboardUse: "カット/カラー、マッサージ、鍼灸のプレミアム許容度を補正" },
  { id: "home_service", sector: "生活サービス", sourceFamily: "BLS services / EIA energy / GDELT labor cost", observedSignal: "人件費、移動燃料、生活費ニュース", updateCadence: "月次+週次+日次ニュース", quality: "estimated", dashboardUse: "クリーニング、通訳同行、車、ペットサービスの値上げ余地を評価" },
  { id: "photo_experience", sector: "写真・体験・観光", sourceFamily: "米国公開価格 / 為替 / GDELT旅行消費", observedSignal: "PCS・記念需要、米国写真相場、円安割安感", updateCadence: "日次ニュース+手動", quality: "estimated", dashboardUse: "家族写真、ツアー、記念品のドル体感価格を強調" },
  { id: "education", sector: "教育・語学", sourceFamily: "BLS education services / GDELT family adaptation", observedSignal: "教育サービス価格、生活適応ニュース", updateCadence: "月次+日次ニュース", quality: "estimated", dashboardUse: "日本語/子どもレッスンの継続価格を評価" }
];
