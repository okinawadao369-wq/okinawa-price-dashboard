export type Segment = {
  id: string;
  label: string;
  monthlyIncome: number;
  priceSensitivity: number;
  premiumAppetite: number;
  description: string;
};

export type Area = {
  area: string;
  bases: string;
  share: number;
  affinity: number;
  note: string;
};

export type Industry = {
  id: string;
  group: string;
  industry: string;
  usLow: number;
  usHigh: number;
  okinawaCurrent: number;
  unit: string;
  discount: number;
  premium: number;
  need: number;
  frequency: string;
  comment: string;
};

export type FredSeries = {
  id: string;
  label: string;
  meaning: string;
  fallback: number;
  yoy: boolean;
  unit: string;
};

export type NewsTopic = {
  id: string;
  label: string;
  query: string;
  weight: number;
  scoreRole: "eastAsiaTension" | "forwardPosture" | "okinawaBase" | "consumerStress" | "marketRisk";
};

export const segments: Segment[] = [
  { id: "E1E3", label: "E-1〜E-3 若年・価格敏感", monthlyIncome: 3100, priceSensitivity: 1.18, premiumAppetite: 0.62, description: "低単価・即決・友人紹介。飲食、車、娯楽、低価格体験に反応。" },
  { id: "E4E6", label: "E-4〜E-6 主力ファミリー", monthlyIncome: 4600, priceSensitivity: 1.0, premiumAppetite: 0.84, description: "妊婦、乳幼児、家族写真、外食、記念体験の中心層。FamilyTreeOkiの主戦場。" },
  { id: "E7E9", label: "E-7〜E-9 シニアNCO", monthlyIncome: 6800, priceSensitivity: 0.82, premiumAppetite: 0.96, description: "価格より信頼・評判・紹介・プライバシー重視。" },
  { id: "O1O4", label: "O-1〜O-4 士官層", monthlyIncome: 7800, priceSensitivity: 0.76, premiumAppetite: 1.08, description: "高LTV。家族向け、写真、産前産後、ウェルネス、教育サービスに強い。" },
  { id: "DODGS", label: "DoD/GS軍属・民間職員", monthlyIncome: 7200, priceSensitivity: 0.8, premiumAppetite: 1.05, description: "民間消費に近い意思決定。品質・レビュー・英語導線・予約の簡単さが重要。" }
];

export const areas: Area[] = [
  { area: "嘉手納・北谷・沖縄市・読谷", bases: "Kadena AB / Torii / Foster導線", share: 0.38, affinity: 95, note: "嘉手納中心の最重要商圏。ドル所得・家族帯同・外食/小売消費が厚い。" },
  { area: "宜野湾・北中城・ライカム・普天間", bases: "MCAS Futenma / Camp Foster", share: 0.24, affinity: 88, note: "海兵隊ファミリーと大型商業導線。口コミ導線が強い。" },
  { area: "うるま・金武・ハンセン/コートニー", bases: "Camp Hansen / Courtney", share: 0.18, affinity: 74, note: "若年・単身比率が上がる。エントリー価格・夜間需要に強い。" },
  { area: "浦添・牧港・那覇", bases: "Camp Kinser / Naha", share: 0.07, affinity: 66, note: "都市型消費。予約型・週末型・美容/外食に向く。" },
  { area: "名護東海岸・シュワブ・辺野古", bases: "Camp Schwab / Henoko", share: 0.08, affinity: 61, note: "距離課題あり。出張型・週末型・パッケージが重要。" },
  { area: "恩納・北谷海岸・観光導線", bases: "Leisure / PCS memory", share: 0.05, affinity: 70, note: "家族写真・記念品・沖縄体験に強い。" }
];

export const industries: Industry[] = [
  { id: "ft_2d", group: "FamilyTreeOki固定", industry: "2Dエコー / Private 1-hour session", usLow: 150, usHigh: 215, okinawaCurrent: 15000, unit: "1時間予約枠", discount: 0.75, premium: 1.18, need: 0.86, frequency: "妊娠中1〜2回", comment: "現行維持。米国1時間比較では割安。" },
  { id: "ft_4d", group: "FamilyTreeOki固定", industry: "4Dエコー / Private 1-hour memory session", usLow: 150, usHigh: 265, okinawaCurrent: 20000, unit: "1時間予約枠", discount: 0.76, premium: 1.22, need: 0.92, frequency: "妊娠中1〜2回", comment: "入口価格として非常に強い。上位パッケージ余地大。" },
  { id: "ft_sitter_basic", group: "FamilyTreeOki固定", industry: "一般ベビーシッター", usLow: 19.81, usHigh: 26.24, okinawaCurrent: 3500, unit: "1時間", discount: 0.85, premium: 1, need: 0.76, frequency: "週1〜複数回", comment: "米国一般相場と同等。入口価格として維持。" },
  { id: "ft_sitter_med", group: "FamilyTreeOki固定", industry: "医療系乳児・新生児・産後ケア", usLow: 35, usHigh: 80, okinawaCurrent: 3500, unit: "1時間", discount: 0.82, premium: 1.35, need: 0.95, frequency: "産後/夜間", comment: "看護師・助産師対応なら安すぎる。別単価化推奨。" },
  { id: "cafe_latte", group: "飲食業", industry: "カフェ / ラテ・ドリンク", usLow: 5, usHigh: 8, okinawaCurrent: 700, unit: "1杯", discount: 0.72, premium: 1, need: 0.55, frequency: "高頻度", comment: "基地外カフェは$5未満に見えると強い。" },
  { id: "casual_lunch", group: "飲食業", industry: "カジュアルランチ", usLow: 12, usHigh: 20, okinawaCurrent: 1800, unit: "1人前", discount: 0.72, premium: 1.02, need: 0.62, frequency: "週次", comment: "$10〜$15に見える価格帯が買いやすい。" },
  { id: "family_dinner", group: "飲食業", industry: "ファミリーディナー", usLow: 25, usHigh: 45, okinawaCurrent: 3800, unit: "1人前", discount: 0.76, premium: 1.05, need: 0.6, frequency: "月数回", comment: "家族4人合計で$80〜$120以内が心理ライン。" },
  { id: "premium_dining", group: "飲食業", industry: "沖縄プレミアムディナー/記念日", usLow: 55, usHigh: 95, okinawaCurrent: 8500, unit: "1人前", discount: 0.78, premium: 1.12, need: 0.52, frequency: "記念日/観光", comment: "O-3以上・GS・PCS前に向く。" },
  { id: "house_cleaning", group: "生活サービス", industry: "ハウスクリーニング", usLow: 35, usHigh: 75, okinawaCurrent: 6000, unit: "1時間/1名", discount: 0.8, premium: 1.05, need: 0.72, frequency: "月1〜隔週", comment: "基地外住宅・共働き・産後に需要。" },
  { id: "car_detail", group: "生活サービス", industry: "車内外クリーニング/ディテール", usLow: 80, usHigh: 180, okinawaCurrent: 15000, unit: "1回", discount: 0.82, premium: 1, need: 0.58, frequency: "PCS前/季節", comment: "PCS前の売却準備需要。" },
  { id: "pet_sitting", group: "生活サービス", industry: "ペットシッター/短時間訪問", usLow: 20, usHigh: 40, okinawaCurrent: 3500, unit: "1訪問", discount: 0.82, premium: 1.05, need: 0.66, frequency: "旅行/週末", comment: "米軍家族のペット保有層に有効。" },
  { id: "translation_admin", group: "生活サービス", industry: "通訳・行政/病院同行サポート", usLow: 40, usHigh: 100, okinawaCurrent: 9000, unit: "1時間", discount: 0.9, premium: 1.25, need: 0.8, frequency: "必要時", comment: "日本語不安解消に高い支払意欲。" },
  { id: "hair_color_women", group: "美容・ウェルネス", industry: "女性カット/カラー", usLow: 100, usHigh: 250, okinawaCurrent: 18000, unit: "1回", discount: 0.75, premium: 1.1, need: 0.62, frequency: "月1〜数ヶ月", comment: "士官配偶者・軍属女性に高単価可能。" },
  { id: "massage_60", group: "美容・ウェルネス", industry: "マッサージ 60分", usLow: 60, usHigh: 150, okinawaCurrent: 9000, unit: "60分", discount: 0.78, premium: 1.05, need: 0.64, frequency: "月次", comment: "疲労・妊婦・リラクゼーション需要。" },
  { id: "acupuncture", group: "美容・ウェルネス", industry: "鍼灸・ウェルネス 60分", usLow: 75, usHigh: 200, okinawaCurrent: 10000, unit: "60分", discount: 0.78, premium: 1.12, need: 0.58, frequency: "継続型", comment: "医療広告・妊婦表現は慎重に設計。" },
  { id: "baby_keepsake", group: "小売・ギフト", industry: "Heartbeat Animal / ベビー記念品", usLow: 35, usHigh: 80, okinawaCurrent: 6000, unit: "1個", discount: 0.78, premium: 1.12, need: 0.77, frequency: "エコー同時購入", comment: "FamilyTreeOkiのアップセル最重要。" },
  { id: "baby_maternity_retail", group: "小売・ギフト", industry: "ベビー/マタニティ用品", usLow: 25, usHigh: 90, okinawaCurrent: 6000, unit: "1購入", discount: 0.72, premium: 1, need: 0.7, frequency: "妊娠中/出産後", comment: "価格より品揃え・英語説明・安心感。" },
  { id: "family_photo", group: "体験・写真", industry: "家族/ニューボーン写真撮影", usLow: 300, usHigh: 750, okinawaCurrent: 45000, unit: "60〜90分", discount: 0.72, premium: 1.18, need: 0.76, frequency: "PCS/出産/記念", comment: "沖縄滞在記念に非常に強い。" },
  { id: "mini_photo", group: "体験・写真", industry: "ミニフォトセッション", usLow: 175, usHigh: 300, okinawaCurrent: 25000, unit: "20〜30分", discount: 0.72, premium: 1.1, need: 0.67, frequency: "季節/紹介", comment: "入口商品として有効。" },
  { id: "tour_activity", group: "体験・写真", industry: "半日ツアー/アクティビティ", usLow: 60, usHigh: 150, okinawaCurrent: 10000, unit: "1名", discount: 0.75, premium: 1.08, need: 0.6, frequency: "週末/家族来沖", comment: "ファミリー向け・英語安全説明が重要。" },
  { id: "language_lesson", group: "教育・その他", industry: "日本語/英語/子どもレッスン", usLow: 25, usHigh: 70, okinawaCurrent: 5500, unit: "1時間", discount: 0.82, premium: 1.1, need: 0.62, frequency: "継続型", comment: "基地家族の生活適応支援に向く。" }
];

export const fredSeries: FredSeries[] = [
  { id: "DEXJPUS", label: "USD/JPY", meaning: "ドル所得が円価格をどう安く見せるかの中心指標", fallback: 156, yoy: false, unit: "JPY" },
  { id: "CPIAUCSL", label: "CPI All Urban Consumers", meaning: "米国消費者物価。価格許容度の物価アンカー", fallback: 314.1, yoy: true, unit: "index" },
  { id: "CPILFESL", label: "Core CPI", meaning: "食品・エネルギーを除く基調インフレ", fallback: 321.6, yoy: true, unit: "index" },
  { id: "CUSR0000SEFV", label: "Food Away From Home", meaning: "外食価格アンカー", fallback: 396.5, yoy: true, unit: "index" },
  { id: "APU000074714", label: "Regular Gasoline", meaning: "移動・生活コスト心理", fallback: 3.45, yoy: true, unit: "USD/gal" },
  { id: "APU0000708111", label: "Eggs Grade A Large", meaning: "家計の体感物価", fallback: 3.1, yoy: true, unit: "USD/dozen" },
  { id: "UNRATE", label: "Unemployment Rate", meaning: "米国雇用環境。低いほど購買温度が上がる", fallback: 4.1, yoy: false, unit: "%" },
  { id: "CES0500000003", label: "Average Hourly Earnings", meaning: "賃金上昇と可処分所得感", fallback: 35.5, yoy: true, unit: "USD/hour" },
  { id: "FEDFUNDS", label: "Federal Funds Rate", meaning: "金利環境。家計心理と市場リスク", fallback: 4.33, yoy: false, unit: "%" },
  { id: "DGS10", label: "10-Year Treasury Yield", meaning: "市場金利・ドル環境", fallback: 4.45, yoy: false, unit: "%" },
  { id: "UMCSENT", label: "Consumer Sentiment", meaning: "米国家計の気分。高いほど消費に前向き", fallback: 61.8, yoy: false, unit: "index" }
];

export const newsTopics: NewsTopic[] = [
  { id: "taiwan", label: "台湾海峡・中国軍事圧力", query: '(Taiwan OR "Taiwan Strait") (China OR PLA OR military OR blockade OR invasion OR drills OR warship)', weight: 1.25, scoreRole: "eastAsiaTension" },
  { id: "northkorea", label: "北朝鮮ミサイル・核", query: '("North Korea" OR DPRK) (missile OR nuclear OR launch OR military OR sanctions)', weight: 1.15, scoreRole: "eastAsiaTension" },
  { id: "indopacific", label: "米インド太平洋・前方展開", query: '(USINDOPACOM OR "Indo-Pacific" OR "U.S. military" OR Pentagon) (China OR Taiwan OR Japan OR deployment OR exercise)', weight: 1.2, scoreRole: "forwardPosture" },
  { id: "okinawa_usfj", label: "USFJ・沖縄基地・嘉手納/普天間", query: '(USFJ OR "U.S. Forces Japan" OR Kadena OR Okinawa OR Futenma OR "Camp Foster") (base OR military OR Marines OR Air Force OR relocation)', weight: 1.35, scoreRole: "okinawaBase" },
  { id: "henoko", label: "辺野古・沖縄政治・基地移設", query: '(Henoko OR Futenma OR Okinawa) (relocation OR base OR protest OR "Defense Ministry" OR landfill)', weight: 1, scoreRole: "okinawaBase" },
  { id: "us_economy", label: "米国経済・消費ストレス", query: '("U.S. economy" OR inflation OR "gas prices" OR layoffs OR "consumer sentiment" OR "job market")', weight: 1, scoreRole: "consumerStress" },
  { id: "us_politics_market", label: "米国政治・市場・予算", query: '("Federal Reserve" OR Congress OR "defense budget" OR tariffs OR sanctions OR "government shutdown" OR "stock market")', weight: 0.95, scoreRole: "marketRisk" }
];
