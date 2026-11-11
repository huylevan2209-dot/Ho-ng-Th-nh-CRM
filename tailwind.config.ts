import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ht: {
          navy: "#0F2742",
          navyDark: "#0A1D33",
          teal: "#0E9F8E",
          tealSoft: "#E3F6F2",
          amber: "#E8A33D",
          red: "#D9534F",
          bg: "#F6F7F9",
          card: "#FFFFFF",
          line: "#E4E7EB",
          text: "#1B2430",
          muted: "#6B7684"
        }
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      borderRadius: {
        card: "10px"
      }
    }
  },
  plugins: []
};
export default config;
