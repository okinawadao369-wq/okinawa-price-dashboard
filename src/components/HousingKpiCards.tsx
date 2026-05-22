export function HousingKpiCards() {
  const cards = [
    { label: "沖縄主力3BR面積", value: "100〜165㎡", sub: "30〜50坪。米軍家族の実用帯" },
    { label: "沖縄主力家賃", value: "25万〜33万円", sub: "E5/O1/O2〜E6/O3のOHA心理帯" },
    { label: "沖縄坪単価", value: "7,000〜10,000円", sub: "坪あたり。広さ対比で割安に見えやすい" },
    { label: "San Diego家賃", value: "56万〜72万円+", sub: "沖縄の約1.8〜3.0倍の比較アンカー" },
    { label: "最重要商品", value: "120〜160㎡", sub: "3BR / 28万〜33万円 / Kadena・Foster 15分圏" }
  ];

  return (
    <section className="grid-5">
      {cards.map((card) => (
        <div className="card metric print-light" key={card.label}>
          <div className="label">{card.label}</div>
          <div className="value">{card.value}</div>
          <div className="sub">{card.sub}</div>
        </div>
      ))}
    </section>
  );
}
