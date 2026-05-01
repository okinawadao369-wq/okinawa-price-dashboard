# 固定URL化とAPIキー保護

## 推奨構成

- Vercel / Cloudflare Pages / Netlify などに静的フロントエンドをデプロイ
- FRED APIキーはフロントエンドに入れず、サーバー側環境変数 `FRED_API_KEY` に保存
- 本番では `/api/fred?series_id=DEXJPUS` などのプロキシ経由で取得
- GDELTは公開APIのため、現状どおりフロントエンドから直接取得

## Vercelでの手順

1. このフォルダをGitHubへアップロード
2. VercelでNew ProjectとしてImport
3. Environment Variablesに以下を追加

```env
FRED_API_KEY=ここにFRED_APIキー
```

4. Build Commandは `npm run build`
5. Output Directoryは `dist`
6. Deploy後に発行される `https://...vercel.app` が固定共有URL

## ローカル開発

```powershell
npm.cmd install
npm.cmd run dev
```

ローカルだけでFREDを直接使う場合は `.env.local` に以下を書けます。

```env
VITE_FRED_API_KEY=ここにFRED_APIキー
```

ただし、この値はフロントエンドに埋め込まれるため、外部公開では使わないでください。

## 本番デプロイ時の注意

- 役員共有URLを固定化する場合、一時トンネルではなくVercel等の固定URLを使う
- FRED APIキーは `FRED_API_KEY` としてサーバー側だけに保存
- 価格心理・商圏・基地外居住者数は推計モデルとしてUI上に明記する
- TradingViewチャートは表示用で、スコア計算にはFRED値または手入力値を使う
