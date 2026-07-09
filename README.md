# Okinawa U.S. Military Price Psychology Dashboard

React / TypeScript / Vite dashboard for pricing psychology analysis targeting U.S. military, DoD civilians, and families in Okinawa.

## Local Development

```powershell
npm.cmd install
npm.cmd run dev
```

## Production Build

```powershell
npm.cmd run build
```

## GitHub Pages

This project can be published from `Koya932/Koya932` with GitHub Actions.

1. Push `main` to `https://github.com/Koya932/Koya932`.
2. Open `Settings > Pages`.
3. Set `Source` to `GitHub Actions`.
4. Run or wait for `Deploy Dashboard to GitHub Pages`.

Expected URL:

```text
https://koya932.github.io/Koya932/
```

GitHub Pages is static hosting, so serverless API routes do not run there. The client automatically uses the existing Vercel API base for FRED, exchange-rate, RSS, and GDELT proxy calls. Override it only when you have another API host:

```env
VITE_API_BASE_URL=https://your-api-host.example.com
```

## Environment Variables

For production, set this on the hosting provider:

```env
FRED_API_KEY=your_fred_api_key
```

For local-only direct FRED access:

```env
VITE_FRED_API_KEY=your_fred_api_key
```

Do not expose `VITE_FRED_API_KEY` in public deployments unless the key is intended to be public.
