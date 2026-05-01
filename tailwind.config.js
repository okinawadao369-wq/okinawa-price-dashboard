/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#071018",
        panel: "#0d1722",
        line: "#223243",
        gold: "#d6b25e"
      },
      boxShadow: {
        glow: "0 0 40px rgba(214, 178, 94, 0.12)"
      }
    }
  },
  plugins: []
};
