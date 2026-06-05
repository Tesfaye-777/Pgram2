import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        void: "#080704",
        panel: "#19130d",
        jade: "#8de6c8",
        cinnabar: "#c94b3a",
        gold: "#d8b35a",
        parchment: "#f2e4bd",
        ink: "#15110b"
      },
      boxShadow: {
        jade: "0 0 24px rgba(141, 230, 200, 0.18)",
        cinnabar: "0 0 22px rgba(201, 75, 58, 0.2)",
        gold: "0 0 22px rgba(216, 179, 90, 0.28)"
      },
      backgroundImage: {
        "xian-pattern":
          "radial-gradient(circle at 1px 1px, rgba(216,179,90,.16) 1px, transparent 0)"
      }
    }
  },
  plugins: []
};

export default config;
