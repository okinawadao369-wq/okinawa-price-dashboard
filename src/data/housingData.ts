export const HOUSING_CONVERSIONS = {
  sqftToSqm: 0.092903,
  sqmToTsubo: 0.3025,
  tsuboToSqm: 3.3058,
  defaultFx: 158.3
};

export type OhaRankBudget = {
  id: string;
  label: string;
  rentAllowanceUsd: number;
  utilityAllowanceUsd: number;
  totalHousingBudgetUsd: number;
  rentAllowanceJpy: number;
  totalHousingBudgetJpy: number;
  targetSqmRange: [number, number];
  targetTsuboRange: [number, number];
  practicalRentJpyRange: [number, number];
  psychology: string;
};

export type HousingSizeStandard = {
  rankGroup: string;
  bedrooms: string;
  sqft: number;
  sqm: number;
  tsubo: number;
};

export type HousingExample = {
  id: string;
  market: string;
  area?: string;
  label: string;
  bedrooms: number;
  sqft: number;
  sqm: number;
  tsubo: number;
  rentJpy: number;
  rentUsd: number;
  rentPerSqmJpy?: number;
  rentPerTsuboJpy: number;
  rentPerSqftUsd: number;
  baseDistanceMinutes?: number;
  parkingSpaces?: number;
  petFriendly?: boolean;
  englishContract?: boolean;
  humidityResistant?: boolean;
  familyRouteScore?: number;
  note: string;
};

export const okinawaOhaRankBudgets: OhaRankBudget[] = [
  {
    id: "E1_E4_DEP",
    label: "E-1〜E-4 扶養あり",
    rentAllowanceUsd: 1799,
    utilityAllowanceUsd: 661,
    totalHousingBudgetUsd: 2460,
    rentAllowanceJpy: 284800,
    totalHousingBudgetJpy: 389000,
    targetSqmRange: [100, 135],
    targetTsuboRange: [30, 41],
    practicalRentJpyRange: [180000, 285000],
    psychology: "価格にはやや敏感だが、OHA内であれば家族支出は強い。"
  },
  {
    id: "E5_O1_O2_DEP",
    label: "E-5 / O-1 / O-2 扶養あり",
    rentAllowanceUsd: 1943,
    utilityAllowanceUsd: 661,
    totalHousingBudgetUsd: 2604,
    rentAllowanceJpy: 307600,
    totalHousingBudgetJpy: 412000,
    targetSqmRange: [120, 150],
    targetTsuboRange: [36, 45],
    practicalRentJpyRange: [220000, 310000],
    psychology: "FamilyTreeOki主力層。3BR、子ども、基地アクセス、英語対応を重視。"
  },
  {
    id: "E6_E8_O3_DEP",
    label: "E-6〜E-8 / O-3 扶養あり",
    rentAllowanceUsd: 2105,
    utilityAllowanceUsd: 661,
    totalHousingBudgetUsd: 2766,
    rentAllowanceJpy: 333200,
    totalHousingBudgetJpy: 438000,
    targetSqmRange: [140, 170],
    targetTsuboRange: [42, 51],
    practicalRentJpyRange: [260000, 333000],
    psychology: "プレミアム支出が可能。広さ、静かさ、駐車場、ペット可、眺望を重視。"
  },
  {
    id: "E9_O4_O5_GS_HIGH",
    label: "E-9 / O-4〜O-5 / GS上位",
    rentAllowanceUsd: 2500,
    utilityAllowanceUsd: 661,
    totalHousingBudgetUsd: 3161,
    rentAllowanceJpy: 395800,
    totalHousingBudgetJpy: 500000,
    targetSqmRange: [160, 215],
    targetTsuboRange: [48, 65],
    practicalRentJpyRange: [350000, 450000],
    psychology: "高単価サービスに反応。プライバシー、学校、地域、眺望、静かさを重視。"
  },
  {
    id: "O6_EXECUTIVE",
    label: "O-6以上 / Executive / 上級軍属",
    rentAllowanceUsd: 3000,
    utilityAllowanceUsd: 661,
    totalHousingBudgetUsd: 3661,
    rentAllowanceJpy: 474900,
    totalHousingBudgetJpy: 579000,
    targetSqmRange: [200, 260],
    targetTsuboRange: [60, 79],
    practicalRentJpyRange: [450000, 600000],
    psychology: "プレミアム住宅。眺望、庭、セキュリティ、広さ、静かな環境を重視。"
  }
];

export const usMilitaryHousingSizeStandards: HousingSizeStandard[] = [
  { rankGroup: "E1〜E6", bedrooms: "3BR", sqft: 1630, sqm: 151, tsubo: 45.7 },
  { rankGroup: "E1〜E6", bedrooms: "4BR", sqft: 1950, sqm: 181, tsubo: 54.8 },
  { rankGroup: "E7/E8・W1〜W3・O3", bedrooms: "3BR", sqft: 1860, sqm: 173, tsubo: 52.3 },
  { rankGroup: "E7/E8・W1〜W3・O3", bedrooms: "4BR", sqft: 2150, sqm: 200, tsubo: 60.5 },
  { rankGroup: "O4〜O5", bedrooms: "3BR", sqft: 2020, sqm: 188, tsubo: 56.9 },
  { rankGroup: "O4〜O5", bedrooms: "4BR", sqft: 2310, sqm: 215, tsubo: 65 },
  { rankGroup: "O6", bedrooms: "4BR", sqft: 2520, sqm: 234, tsubo: 70.8 }
];

export const okinawaMilitaryHousingExamples: HousingExample[] = [
  { id: "okinawa_kadena_1385_300k", market: "Okinawa", area: "Kadena近郊", label: "Kadena近郊 3BR", bedrooms: 3, sqft: 1385, sqm: 128.7, tsubo: 38.9, rentJpy: 300000, rentUsd: 1895, rentPerSqmJpy: 2331, rentPerTsuboJpy: 7708, rentPerSqftUsd: 1.37, baseDistanceMinutes: 15, parkingSpaces: 2, petFriendly: false, englishContract: true, humidityResistant: true, familyRouteScore: 70, note: "便利だが米軍公式3BR基準151㎡よりやや小さめ。" },
  { id: "okinawa_yard_1540_300k", market: "Okinawa", area: "沖縄中部", label: "庭付き3BR", bedrooms: 3, sqft: 1540, sqm: 143.1, tsubo: 43.3, rentJpy: 300000, rentUsd: 1895, rentPerSqmJpy: 2096, rentPerTsuboJpy: 6932, rentPerSqftUsd: 1.23, baseDistanceMinutes: 15, parkingSpaces: 2, petFriendly: true, englishContract: true, humidityResistant: true, familyRouteScore: 82, note: "140㎡超で米軍感覚に近い。E5/O1/O2〜E6/O3向け。" },
  { id: "okinawa_rycom_1070_300k", market: "Okinawa", area: "Rycom近く", label: "Rycom近く3BR", bedrooms: 3, sqft: 1070, sqm: 99.4, tsubo: 30.1, rentJpy: 300000, rentUsd: 1895, rentPerSqmJpy: 3018, rentPerTsuboJpy: 9977, rentPerSqftUsd: 1.77, baseDistanceMinutes: 20, parkingSpaces: 2, petFriendly: false, englishContract: true, humidityResistant: true, familyRouteScore: 78, note: "面積は小さめ。立地・利便性で補う必要がある。" },
  { id: "okinawa_yomitan_1780_400k", market: "Okinawa", area: "読谷/北谷方面", label: "広め3BR", bedrooms: 3, sqft: 1780, sqm: 165.4, tsubo: 50, rentJpy: 400000, rentUsd: 2527, rentPerSqmJpy: 2418, rentPerTsuboJpy: 7996, rentPerSqftUsd: 1.42, baseDistanceMinutes: 25, parkingSpaces: 2, petFriendly: true, englishContract: true, humidityResistant: true, familyRouteScore: 80, note: "170㎡近く、E6/O3以上や上位軍属向け。" }
];

export const japanMainlandMilitaryHousingExamples: HousingExample[] = [
  { id: "yokosuka_3br_791_209k", market: "Yokosuka", label: "横須賀 3BR", bedrooms: 3, sqft: 791, sqm: 73.5, tsubo: 22.2, rentJpy: 209000, rentUsd: 1320, rentPerTsuboJpy: 9402, rentPerSqftUsd: 1.67, note: "駅・基地近接型だが沖縄3BRよりかなり狭い。" },
  { id: "yokosuka_3br_840_210k", market: "Yokosuka", label: "横須賀 3BR", bedrooms: 3, sqft: 840, sqm: 78, tsubo: 23.6, rentJpy: 210000, rentUsd: 1327, rentPerTsuboJpy: 8896, rentPerSqftUsd: 1.58, note: "沖縄と比較すると面積が小さく、坪単価は高め。" },
  { id: "zushi_1595_420k", market: "Zushi / Yokosuka", label: "逗子上位物件", bedrooms: 4, sqft: 1595, sqm: 148.2, tsubo: 44.8, rentJpy: 420000, rentUsd: 2653, rentPerTsuboJpy: 9370, rentPerSqftUsd: 1.66, note: "上位軍人・軍属向け。沖縄上位物件より高い。" }
];

export const usMilitaryHousingExamples: HousingExample[] = [
  { id: "san_diego_gateway_4br", market: "San Diego", label: "San Diego Gateway 4BR", bedrooms: 4, sqft: 1695, sqm: 157.5, tsubo: 47.6, rentJpy: 566600, rentUsd: 3579, rentPerTsuboJpy: 11894, rentPerSqftUsd: 2.11, note: "San Diego軍人住宅。沖縄より家賃が高い。" },
  { id: "san_diego_serra_3br", market: "San Diego", label: "San Diego Serra Mesa 3BR", bedrooms: 3, sqft: 1452, sqm: 134.9, tsubo: 40.8, rentJpy: 566600, rentUsd: 3579, rentPerTsuboJpy: 13884, rentPerSqftUsd: 2.46, note: "沖縄の同面積帯より明確に高い。" },
  { id: "san_diego_condo_3br", market: "San Diego", label: "San Diego 3BR Condo", bedrooms: 3, sqft: 1400, sqm: 130.1, tsubo: 39.4, rentJpy: 918000, rentUsd: 5800, rentPerTsuboJpy: 23336, rentPerSqftUsd: 4.14, note: "米国西海岸の高家賃感を示す例。" }
];

export const usBahBudgets = [
  { area: "San Diego", e5WithDependents: 3975, o3WithDependents: 4518, note: "西海岸高家賃市場。沖縄OHAの約2倍。" },
  { area: "Camp Pendleton", e5WithDependents: 3963, o3WithDependents: 4659, note: "海兵隊ファミリーに関係。沖縄と比較する重要市場。" },
  { area: "Oahu / Hawaii", e5WithDependents: 3663, o3WithDependents: 4428, note: "太平洋軍・島嶼住宅市場として比較対象。" },
  { area: "Fort Liberty / Bragg", e5WithDependents: 1806, o3WithDependents: 2175, note: "沖縄OHAに近い米国中価格帯基地。" }
];

export const housingProductStrategies = [
  { label: "Entry Military 3BR", sqmRange: "95〜115㎡", tsuboRange: "29〜35坪", rentRange: "20万〜25万円", target: "E1〜E4、若年家族", strategy: "OHA内に収まりやすい。基地近接・駐車場・英語契約が重要。" },
  { label: "Standard 3BR", sqmRange: "120〜145㎡", tsuboRange: "36〜44坪", rentRange: "26万〜31万円", target: "E5/O1/O2", strategy: "最重要ゾーン。FamilyTreeOki顧客層と重なる。" },
  { label: "Premium 3BR", sqmRange: "145〜170㎡", tsuboRange: "44〜51坪", rentRange: "30万〜38万円", target: "E6〜E8/O3", strategy: "広さ・庭・ペット・眺望で上位化可能。" },
  { label: "4BR Family House", sqmRange: "170〜200㎡", tsuboRange: "51〜60坪", rentRange: "35万〜45万円", target: "E7以上/O3以上/GS上位", strategy: "家族帯同・学校導線・プライバシー重視。" },
  { label: "Executive / Ocean / Yard", sqmRange: "200㎡超", tsuboRange: "60坪超", rentRange: "45万円以上", target: "O4以上/上級軍属", strategy: "プレミアム住宅。眺望、庭、セキュリティ、静けさを訴求。" }
];
