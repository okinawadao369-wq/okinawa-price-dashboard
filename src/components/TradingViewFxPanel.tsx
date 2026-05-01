export function TradingViewFxPanel() {
  const widgetUrl = new URL("https://s.tradingview.com/widgetembed/");
  widgetUrl.searchParams.set("symbol", "FX:USDJPY");
  widgetUrl.searchParams.set("interval", "D");
  widgetUrl.searchParams.set("hidesidetoolbar", "1");
  widgetUrl.searchParams.set("symboledit", "0");
  widgetUrl.searchParams.set("saveimage", "0");
  widgetUrl.searchParams.set("toolbarbg", "111827");
  widgetUrl.searchParams.set("studies", "[]");
  widgetUrl.searchParams.set("theme", "dark");
  widgetUrl.searchParams.set("style", "1");
  widgetUrl.searchParams.set("timezone", "Asia/Tokyo");
  widgetUrl.searchParams.set("locale", "ja");
  widgetUrl.searchParams.set("withdateranges", "1");
  widgetUrl.searchParams.set("hideideas", "1");
  widgetUrl.searchParams.set("studies_overrides", "{}");
  widgetUrl.searchParams.set("overrides", "{}");
  widgetUrl.searchParams.set("enabled_features", "[]");
  widgetUrl.searchParams.set("disabled_features", "[]");
  widgetUrl.searchParams.set("utm_source", "localhost");
  widgetUrl.searchParams.set("utm_medium", "widget");
  widgetUrl.searchParams.set("utm_campaign", "chart");

  return (
    <section className="card print-light fx-chart-card">
      <div className="fx-panel-head">
        <div>
          <h2>USD/JPY 日次チャート（TradingView）</h2>
          <p className="note">日々の為替感を確認する表示パネルです。価格心理スコアの計算値はFREDまたは手入力のUSD/JPYを使います。</p>
        </div>
        <a className="pill info" href="https://jp.tradingview.com/chart/MRpgkgSB/?symbol=FX%3AUSDJPY" target="_blank" rel="noreferrer">
          TradingViewで開く
        </a>
      </div>
      <div className="tv-chart-outer">
        <iframe
          title="USDJPY TradingView chart"
          className="tv-direct-iframe"
          src={widgetUrl.toString()}
          allowFullScreen
        />
      </div>
      <div className="chart-clear-space" aria-hidden="true" />
    </section>
  );
}
