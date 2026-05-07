export type StrategicSource = {
  label: string;
  url: string;
  kind: "official" | "media" | "market" | "model";
};

export type StrategicFactor = {
  id: string;
  label: string;
  category: string;
  baseScore: number;
  priceImpact: number;
  direction: "需要押上げ" | "慎重化" | "混合";
  rationale: string;
  pricePsychology: string;
  sources: StrategicSource[];
};

export const strategicFactors: StrategicFactor[] = [
  {
    id: "usfj_joint_hq",
    label: "USFJ統合司令部化",
    category: "米軍機能",
    baseScore: 84,
    priceImpact: 4.2,
    direction: "需要押上げ",
    rationale: "在日米軍の指揮統制が段階的に統合司令部化へ向かい、平時・有事の連携機能が強まる見立て。",
    pricePsychology: "沖縄を含む在日米軍経済の継続性を高く見せ、英語対応・予約型・信頼型サービスの価格許容を押し上げる。",
    sources: [
      { label: "U.S. DoD: USFJ Joint Force Headquarters", url: "https://www.defense.gov/News/News-Stories/Article/Article/3852213/us-intends-to-reconstitute-us-forces-japan-as-joint-forces-headquarters/", kind: "official" },
      { label: "U.S. DoD 2+2 Fact Sheet", url: "https://www.defense.gov/News/Releases/Release/Article/3852200/fact-sheet-joint-statement-of-the-security-consultative-committee-22/", kind: "official" }
    ]
  },
  {
    id: "mlr_okinawa",
    label: "12th MLR / 南西諸島前方展開",
    category: "沖縄米軍",
    baseScore: 88,
    priceImpact: 4.8,
    direction: "需要押上げ",
    rationale: "沖縄の12th Marine Littoral Regimentは最終下位部隊の設置まで進み、第一列島線の即応・抑止機能が明確化。",
    pricePsychology: "短期滞在ではなく、家族帯同・PCS・訓練ローテーションを含む実需が残る前提を強める。",
    sources: [
      { label: "12th MLR: 12th LCT Established", url: "https://www.12thmlr.marines.mil/Media-Room/News/Article/Article/4101274/12th-lct-established-enhances-12th-mlrs-warfighting-readiness/", kind: "official" },
      { label: "12th MLR official site", url: "https://www.12thmlr.marines.mil/", kind: "official" }
    ]
  },
  {
    id: "guam_force_flow",
    label: "グアム移転開始と沖縄負担軽減",
    category: "再編",
    baseScore: 58,
    priceImpact: -1.8,
    direction: "混合",
    rationale: "約100名規模の兵站支援要員からグアム移転が開始。段階的移転だが、この時点では部隊司令部移転ではない。",
    pricePsychology: "長期では一部人口減の不安を作る一方、沖縄の中核機能は残るため、商圏評価は急落ではなく緩やかな調整。",
    sources: [
      { label: "Japan MOD: Commencement of Force Flow", url: "https://www.mod.go.jp/en/article/2024/12/6c46940d514c2bf54e7c946d49f5552e5730c31f.html", kind: "official" },
      { label: "U.S. Marine Corps / MOD joint statement", url: "https://www.marines.mil/News/Press-Releases/Press-Release-Display/Article/4002316/usmcmod-joint-statement-commencement-of-force-flow/", kind: "official" }
    ]
  },
  {
    id: "taiwan_east_asia",
    label: "台湾海峡・東アジア緊張",
    category: "国際政治",
    baseScore: 76,
    priceImpact: 2.6,
    direction: "需要押上げ",
    rationale: "台湾周辺の軍事演習・封鎖想定・米中摩擦は、沖縄の前方展開価値を上げる主要変数。",
    pricePsychology: "基地・軍属関連の継続需要を強めるが、広告表現は政治色を避け、安心・家族・英語対応へ寄せる必要がある。",
    sources: [
      { label: "Al Jazeera Asia news stream", url: "https://www.aljazeera.com/asia/", kind: "media" },
      { label: "Al Jazeera: Taiwan drills report", url: "https://www.aljazeera.com/news/2026/1/1/us-says-chinese-military-drills-around-taiwan-cause-unnecessary-tensions", kind: "media" }
    ]
  },
  {
    id: "us_macro_politics",
    label: "米国政治経済・消費ストレス",
    category: "米国経済",
    baseScore: 64,
    priceImpact: -0.8,
    direction: "慎重化",
    rationale: "金利、インフレ、関税、政府予算、雇用不安は家計の即決性を下げる。FRED/GDELTと合わせて日次補正する。",
    pricePsychology: "値上げ時は米国相場比較とドル換算表示が必須。低単価層には入口価格と紹介導線を残す。",
    sources: [
      { label: "FRED economic series", url: "https://fred.stlouisfed.org/", kind: "market" },
      { label: "Al Jazeera Economy", url: "https://www.aljazeera.com/economy/", kind: "media" }
    ]
  },
  {
    id: "fx_yen_market",
    label: "USD/JPY・円安/介入警戒",
    category: "為替",
    baseScore: 82,
    priceImpact: 3.6,
    direction: "混合",
    rationale: "円安は米軍・軍属から見た円建て価格を割安化する一方、急変動や介入警戒は短期心理を揺らす。",
    pricePsychology: "円価格の横に about $ 表示を置くと割安感が伝わる。高単価商品ほど米国相場との比較が効く。",
    sources: [
      { label: "Bloomberg Currencies", url: "https://www.bloomberg.com/jp/markets/currencies", kind: "market" },
      { label: "TradingView USDJPY visual panel", url: "https://jp.tradingview.com/chart/MRpgkgSB/?symbol=FX%3AUSDJPY", kind: "market" }
    ]
  }
];
