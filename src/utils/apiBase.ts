const DEFAULT_REMOTE_API_BASE = "https://react-typescript-vite-tailwind-css.vercel.app";

export function getRemoteApiBase() {
  const configured = import.meta.env.VITE_API_BASE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");

  if (typeof window !== "undefined" && window.location.hostname.endsWith("github.io")) {
    return DEFAULT_REMOTE_API_BASE;
  }

  return "";
}

export function apiUrl(path: string) {
  const base = getRemoteApiBase();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${normalizedPath}` : normalizedPath;
}
