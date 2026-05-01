import { TopicScore } from "../utils/gdeltClient";

function tone(score: number) {
  if (score >= 70) return "bad";
  if (score >= 55) return "warn";
  return "good";
}

export function GeoNewsPanel({ scores }: { scores: TopicScore[] }) {
  return (
    <section className="card print-light">
      <h2>2. 政治・地政学・マーケット指数：GDELT自動スコア</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>状態</th>
              <th>トピック</th>
              <th>記事数</th>
              <th>自動スコア</th>
              <th>検索式</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((topic) => (
              <tr key={topic.id}>
                <td><span className={`pill ${topic.status === "live" ? "good" : topic.status === "cache" ? "warn" : "bad"}`}>{topic.status}</span></td>
                <td><strong>{topic.label}</strong></td>
                <td>{topic.articleCount}</td>
                <td><span className={`pill ${tone(topic.score)}`}>{Math.round(topic.score)}</span></td>
                <td><span className="small">{topic.query}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="note">指数はニュース件数、重要語、リスク語を簡易加点した営業判断用スコアです。安全保障判断ではなく、米軍家族向け需要環境の補助指標です。</p>
    </section>
  );
}
