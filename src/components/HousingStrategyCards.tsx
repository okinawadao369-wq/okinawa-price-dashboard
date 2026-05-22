import { housingProductStrategies } from "../data/housingData";

export function HousingStrategyCards() {
  return (
    <section className="card print-light">
      <h2>住宅制度 3. 米軍向け住宅商品設計</h2>
      <div className="grid-5">
        {housingProductStrategies.map((item) => (
          <div className="card light metric" key={item.label}>
            <div className="label">{item.target}</div>
            <div className="value" style={{ fontSize: 20 }}>{item.label}</div>
            <div className="sub">{item.sqmRange} / {item.tsuboRange}<br />{item.rentRange}</div>
            <p className="note">{item.strategy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
