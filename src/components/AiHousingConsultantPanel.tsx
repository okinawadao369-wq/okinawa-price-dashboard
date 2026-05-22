import { Copy, Home, X } from "lucide-react";
import { useState } from "react";
import type { HousingExample, OhaRankBudget } from "../data/housingData";
import { housingConsultantText } from "../utils/housingPsychologyEngine";

export function AiHousingConsultantPanel(props: {
  budget: OhaRankBudget;
  example: HousingExample;
  fx: number;
  servicePriceJpy: number;
  serviceLabel: string;
  basePurchaseScore: number;
  finalPurchaseScore: number;
}) {
  const [open, setOpen] = useState(false);
  const text = housingConsultantText(props);
  const prompt = `以下の住宅心理診断を基に、沖縄米軍・軍属家族向けの価格戦略、FamilyTreeOkiの値上げ余地、英語訴求、広告導線を提案してください。\n\n${text}`;

  return (
    <>
      <section className="card ai print-light">
        <h2>AI住宅コンサル：OHA/BAH・住宅満足度診断</h2>
        <p className="scenario">
          選択ランク、OHA家賃枠、想定住宅の広さ、坪単価、基地距離、家族導線から、外部消費余力とFamilyTreeOki価格受容性を診断します。
        </p>
        <div className="actions">
          <button onClick={() => setOpen(true)}>
            <Home size={18} style={{ verticalAlign: "-4px", marginRight: 8 }} />
            住宅心理を相談する
          </button>
          <button className="secondary" onClick={() => navigator.clipboard.writeText(prompt)}>
            <Copy size={16} style={{ verticalAlign: "-3px", marginRight: 8 }} />
            住宅AIプロンプトをコピー
          </button>
        </div>
      </section>
      {open && (
        <div className="modal">
          <div className="modal-box">
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 12 }}>
              <h2 style={{ margin: 0 }}>AI住宅コンサル相談窓口</h2>
              <button className="secondary" onClick={() => setOpen(false)}><X size={18} /></button>
            </div>
            <div className="console">{text}</div>
          </div>
        </div>
      )}
    </>
  );
}
