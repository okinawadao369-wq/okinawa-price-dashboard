import { Activity, ShieldCheck } from "lucide-react";

export function Header() {
  return (
    <header className="topbar print-light">
      <div className="topbar-inner">
        <div className="topbar-copy">
          <div className="eyebrow">
            <ShieldCheck size={18} />
            AI price intelligence / near-auto research
          </div>
          <h1>沖縄米軍・軍属ターゲット層 AI価格心理ダッシュボード｜近似自動調査分析版</h1>
          <div className="subtitle">
            FRED経済データとGDELT国際ニュース検索を組み合わせ、政治・地政学・米国経済マーケットの変化を“開いた時点で”自動スコア化します。管理用ダッシュボードとして、価格心理・商圏・階級属性・ニュースリスクを一画面で確認できます。
          </div>
        </div>
        <div className="card light metric topbar-status">
          <div className="label">Status</div>
          <div className="value" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 22 }}>
            <Activity size={20} color="#38bdf8" />
            Live model
          </div>
          <div className="sub">API + fallback + local cache</div>
        </div>
      </div>
    </header>
  );
}
