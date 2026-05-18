import { FredPoint } from "../utils/fredClient";

function lagLabel(date: string) {
  const parsed = new Date(date);
  if (!Number.isFinite(parsed.getTime())) return null;
  const days = Math.floor((Date.now() - parsed.getTime()) / 86400000);
  if (days <= 3) return null;
  return `${days}日前`;
}

export function FredDataPanel({ data }: { data: FredPoint[] }) {
  return (
    <section className="card print-light">
      <h2>4. FRED/経済データ一覧</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>状態</th><th>系列</th><th>最新値</th><th>YoY</th><th>日付</th><th>意味</th></tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.id}>
                <td><span className={`pill ${d.status === "live" ? "good" : d.status === "cache" ? "warn" : "bad"}`}>{d.status}</span></td>
                <td><strong>{d.label}</strong><br /><span className="small">{d.id}</span></td>
                <td>{d.value.toFixed(d.value < 10 ? 2 : 1)} {d.unit}</td>
                <td>{d.yoy === undefined ? "—" : `${d.yoy.toFixed(1)}%`}</td>
                <td>{d.date}{lagLabel(d.date) && <><br /><span className="pill warn">公式値 {lagLabel(d.date)}</span></>}</td>
                <td><span className="small">{d.meaning}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
