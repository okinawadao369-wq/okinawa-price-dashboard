import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: process.env.GITHUB_PAGES === "true" ? "/Koya932/" : "/",
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    allowedHosts: true
  },
  preview: {
    host: "0.0.0.0",
    allowedHosts: true
  }
});
