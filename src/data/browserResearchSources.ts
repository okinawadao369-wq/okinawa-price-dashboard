import type { EvidenceQuality } from "./monitoringSources";

export type ResearchCollectionMethod = "official_api" | "official_rss" | "gdelt_search" | "licensed_manual" | "model_estimate";

export type BrowserResearchSource = {
  id: string;
  name: string;
  method: ResearchCollectionMethod;
  url: string;
  cadence: string;
  quality: EvidenceQuality;
  canAutoCollect: boolean;
  dashboardMetric: string;
  note: string;
};

export const browserResearchSources: BrowserResearchSource[] = [
  {
    id: "bls_api",
    name: "BLS Public Data API",
    method: "official_api",
    url: "https://api.bls.gov/publicAPI/v2/timeseries/data/",
    cadence: "月次・リリース後",
    quality: "observed",
    canAutoCollect: true,
    dashboardMetric: "CPI、PPI、賃金、サービス価格圧力",
    note: "米国ミクロ価格と雇用・賃金の公式値。業種別価格圧力の基礎データに使う。"
  },
  {
    id: "bea_api",
    name: "BEA API",
    method: "official_api",
    url: "https://apps.bea.gov/api/data/",
    cadence: "月次・四半期",
    quality: "observed",
    canAutoCollect: true,
    dashboardMetric: "個人消費、所得、PCE、景気圧力",
    note: "米国家計の支出余力を測る。価格心理スコアでは市場温度の補助指標にする。"
  },
  {
    id: "eia_api",
    name: "EIA Open Data API",
    method: "official_api",
    url: "https://api.eia.gov/v2/",
    cadence: "週次・月次",
    quality: "observed",
    canAutoCollect: true,
    dashboardMetric: "ガソリン・エネルギー・移動コスト",
    note: "外食、配送、出張型サービス、車関連サービスのコスト圧力へ反映する。APIキーが必要。"
  },
  {
    id: "treasury_api",
    name: "U.S. Treasury Fiscal Data API",
    method: "official_api",
    url: "https://api.fiscaldata.treasury.gov/services/api/fiscal_service/",
    cadence: "日次・月次",
    quality: "observed",
    canAutoCollect: true,
    dashboardMetric: "財政・金利・国債ストレス",
    note: "米国財政・金利環境を市場リスクに反映する。"
  },
  {
    id: "usaspending_api",
    name: "USAspending API",
    method: "official_api",
    url: "https://api.usaspending.gov/api/v2/",
    cadence: "随時・日次",
    quality: "observed",
    canAutoCollect: true,
    dashboardMetric: "国防支出、太平洋抑止、基地関連需要",
    note: "DoD支出やインド太平洋関連支出の変化を、沖縄基地経済の継続性スコアへ反映する。"
  },
  {
    id: "worldbank_api",
    name: "World Bank Indicators API",
    method: "official_api",
    url: "https://api.worldbank.org/v2/",
    cadence: "月次・年次",
    quality: "observed",
    canAutoCollect: true,
    dashboardMetric: "国際マクロ・貿易・安全保障背景",
    note: "国際比較や長期トレンド用。日次価格判断では補助扱い。"
  },
  {
    id: "fed_rss",
    name: "Federal Reserve RSS",
    method: "official_rss",
    url: "https://www.federalreserve.gov/feeds/press_monetary.xml",
    cadence: "随時",
    quality: "observed",
    canAutoCollect: true,
    dashboardMetric: "FRB発言・金融政策イベント",
    note: "FOMC・金利・声明ニュースをRSSで拾い、金融ストレスに反映する。"
  },
  {
    id: "aljazeera_rss",
    name: "Al Jazeera RSS",
    method: "official_rss",
    url: "https://www.aljazeera.com/xml/rss/all.xml",
    cadence: "随時",
    quality: "observed",
    canAutoCollect: true,
    dashboardMetric: "国際政治・戦争・中東/アジア緊張",
    note: "記事本文の複製はせず、見出し・リンク・リスク語カウントだけを使う。"
  },
  {
    id: "gdelt_search",
    name: "GDELT DOC 2.0 search",
    method: "gdelt_search",
    url: "https://api.gdeltproject.org/api/v2/doc/doc",
    cadence: "1d/2d/3d/7d",
    quality: "observed",
    canAutoCollect: true,
    dashboardMetric: "台湾、北朝鮮、USFJ、沖縄基地、米国経済ニュース",
    note: "多媒体横断検索。レート制限時はcache/fallback表示に切り替える。"
  },
  {
    id: "dod_rss",
    name: "DoD / War.gov official RSS",
    method: "official_rss",
    url: "https://www.war.gov/News/RSS/index.html/",
    cadence: "随時",
    quality: "observed",
    canAutoCollect: true,
    dashboardMetric: "米軍作戦・同盟・即応性・装備/予算ニュース",
    note: "公式RSSから見出しを取得し、軍関連リスク/前方展開スコアの補助信号にする。"
  },
  {
    id: "usfj_official",
    name: "U.S. Forces Japan official site",
    method: "gdelt_search",
    url: "https://www.usfj.mil/",
    cadence: "随時",
    quality: "observed",
    canAutoCollect: true,
    dashboardMetric: "USFJ再編・沖縄関係・共同訓練/共同パトロール",
    note: "公式サイトはGDELT/RSS補助と手動確認を組み合わせ、沖縄基地関連指数に反映する。"
  },
  {
    id: "mlr_official",
    name: "12th Marine Littoral Regiment official site",
    method: "gdelt_search",
    url: "https://www.12thmlr.marines.mil/",
    cadence: "随時",
    quality: "observed",
    canAutoCollect: true,
    dashboardMetric: "第一列島線・12th MLR・沖縄前方展開",
    note: "沖縄の軍編成機能を読む重要ソース。価格心理では基地経済の継続性に反映する。"
  },
  {
    id: "bloomberg_tradingview",
    name: "Bloomberg / TradingView",
    method: "licensed_manual",
    url: "https://www.bloomberg.com/jp/markets/currencies",
    cadence: "リアルタイム参照",
    quality: "estimated",
    canAutoCollect: false,
    dashboardMetric: "為替・市場確認",
    note: "ライセンス性が強いため、自動取得ではなく表示・手動確認・公式/公開APIとの照合に限定する。"
  },
  {
    id: "company_prices",
    name: "企業別公開価格・サービス価格",
    method: "model_estimate",
    url: "manual://public-price-review",
    cadence: "月次手動確認",
    quality: "estimated",
    canAutoCollect: false,
    dashboardMetric: "業種別単価・値上げ余地",
    note: "店舗や企業ごとの価格は変更・地域差・規約制約が大きいため、公開価格の定期確認と推計モデルで扱う。"
  }
];
