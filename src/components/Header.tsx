import { Activity, ShieldCheck } from "lucide-react";

type SourceStatus = {
  label: string;
  detail: string;
  tone: "good" | "warn" | "bad";
};

export function Header({ sourceStatus }: { sourceStatus: SourceStatus }) {
  const iconColor = sourceStatus.tone === "good" ? "#22c55e" : sourceStatus.tone === "warn" ? "#f59e0b" : "#ef4444";

  return (
    <header className="topbar print-light">
      <div className="topbar-inner">
        <div className="topbar-copy">
          <div className="eyebrow">
            <ShieldCheck size={18} />
            AI価格情報 / 自動車関連調査
          </div>
          <h1>沖縄米軍・軍属ターゲット層 AI価格心理ダッシュボード｜近似自動調査分析版</h1>
          <div className="subtitle">
            FRED経済データとGDELT国際ニュース検索を組み合わせ、政治・地政学・米国経済マーケットの変化を開いた瞬間に自動採点します。
            管理用ダッシュボードとして、価格心理・商圏・階級属性・ニュースリスクを一画面で確認できます。
          </div>
        </div>
        <div className="card light metric topbar-status">
          <div className="label">状態</div>
          <div className="value" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 22 }}>
            <Activity size={20} color={iconColor} />
            {sourceStatus.label}
          </div>
          <div className="sub">{sourceStatus.detail}</div>
        </div>
      </div>
    </header>
  );
}
