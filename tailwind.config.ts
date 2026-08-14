import type {Config} from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "rgb(var(--ink) / <alpha-value>)",
          soft: "rgb(var(--ink-2) / <alpha-value>)",
          faint: "rgb(var(--ink-3) / <alpha-value>)",
        },
        paper: {
          DEFAULT: "rgb(var(--paper) / <alpha-value>)",
          lift: "rgb(var(--paper-2) / <alpha-value>)",
        },
        well: {
          DEFAULT: "rgb(var(--well) / <alpha-value>)",
          lift: "rgb(var(--well-2) / <alpha-value>)",
          fg: "rgb(var(--on-well) / <alpha-value>)",
          muted: "rgb(var(--on-well-2) / <alpha-value>)",
        },
        accent: "rgb(var(--accent) / <alpha-value>)",
        // Hairlines carry a fixed alpha, so they take no modifier.
        rule: {
          DEFAULT: "rgb(var(--ink) / 0.16)",
          soft: "rgb(var(--ink) / 0.08)",
          well: "rgb(var(--on-well) / 0.14)",
        },
      },
      // Multi-word family names must carry their own quotes — Tailwind joins the
      // array verbatim, and one unquoted name invalidates the whole declaration.
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", '"Times New Roman"', "serif"],
        body: ['"IBM Plex Sans"', "system-ui", "-apple-system", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", '"SF Mono"', "monospace"],
      },
      maxWidth: {
        shell: "1320px",
      },
      transitionTimingFunction: {
        resolve: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
