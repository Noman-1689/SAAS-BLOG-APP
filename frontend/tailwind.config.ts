import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // --- CANVAS.OS CUSTOM ANIMATIONS ---
      keyframes: {
        scanline: {
          "0%": { top: "-20%" },
          "100%": { top: "120%" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        // The scanline used in the Image Library
        scan: "scanline 3s linear infinite",
        // A softer pulse for background glow elements
        "pulse-slow": "pulse-soft 4s ease-in-out infinite",
      },
      // --- CUSTOM COLOR OPACITIES ---
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    // This plugin allows you to use 'scrollbar-none' to hide scrollbars while keeping functionality
    function ({ addUtilities }: any) {
      addUtilities({
        ".scrollbar-none": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      });
    },
  ],
};

export default config;
