import { Copy, MessageSquare, X } from "lucide-react";
import { useState } from "react";
import { Area, Industry, Segment } from "../data/baseData";
import { consultantText } from "../utils/pricingEngine";

export function AiConsultantPanel(props: {
  item: Industry;
  segment: Segment;
  area: Area;
  priceJPY: number;
  fx: number;
  range: [number, number];
  score: number;
  geoRisk: number;
  marketTemperature: number;
}) {
  const [open, setOpen] = useState(false);
  const text = consultantText(props);
  const prompt = `以下の価格診断を外部AIで深掘りしてください。沖縄の米軍人・軍属・DoD civilian・米軍家族向けマーケティングとして、価格、英語訴求、広告、アップセル案を具体化してください。\n\n${text}`;
  return (
    <>
      <section className="card ai print-light">
        <h2>AIコンサル部下：米軍・軍属価格心理アナリスト</h2>
        <p className="scenario">
          選択中の業種・単価・ターゲット層に加え、FRED更新値とGDELTニューススコアを読み取り、米軍・軍属向け価格戦略を診断します。外部AI APIは使わず、ルールベース診断として動作します。
        </p>
        <div className="actions">
          <button onClick={() => setOpen(true)}>
            <MessageSquare size={18} style={{ verticalAlign: "-4px", marginRight: 8 }} />
            アメリカ心理価格帯を相談する
          </button>
          <button className="secondary" onClick={() => navigator.clipboard.writeText(prompt)}>
            <Copy size={16} style={{ verticalAlign: "-3px", marginRight: 8 }} />
            外部AI用プロンプトをコピー
          </button>
        </div>
      </section>
      {open && (
        <div className="modal">
          <div className="modal-box">
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 12 }}>
              <h2 style={{ margin: 0 }}>AIコンサル相談窓口</h2>
              <button className="secondary" onClick={() => setOpen(false)}><X size={18} /></button>
            </div>
            <div className="grid-2">
              <div>
                <label className="field-label">相談内容</label>
                <textarea defaultValue="この業種の価格を米軍・軍属ターゲット向けに最適化してください。最新の経済・政治・地政学スコアも踏まえて、値上げ余地、英語での売り方、広告戦略を出してください。" />
                <div className="actions" style={{ marginTop: 10 }}>
                  <button onClick={() => navigator.clipboard.writeText(text)}>診断結果をコピー</button>
                  <button className="secondary" onClick={() => navigator.clipboard.writeText(prompt)}>外部AI用プロンプトをコピー</button>
                </div>
              </div>
              <div>
                <label className="field-label">AIコンサル回答</label>
                <div className="console">{text}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
