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
