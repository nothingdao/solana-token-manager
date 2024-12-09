/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
        mono: [
          "SF Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace"
        ],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        day: {
          primary: "#111",
          secondary: "#00C2E0",
          accent: "#FFCA28",
          neutral: "#303841",
          "base-100": "#FFFFFF",
          "base-200": "#F7FAFC",
          "base-300": "#EDF2F7",
          info: "#00B8D4",
          success: "#18DB93",
          warning: "#FFB024",
          error: "#ED4A31",

          // Day theme overrides
          ".btn": {
            "border-radius": "0.35rem",
            "text-transform": "uppercase",
            "font-weight": "600",
            "transition": "all 0.3s ease",
            "box-shadow": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            "&:hover": {
              "box-shadow": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              "transform": "translateY(-2px)",
            },
          },
          ".card": {
            "border-radius": "1rem",
            "box-shadow": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            "background": "linear-gradient(135deg, var(--base-100), var(--base-200))",
          },
          ".navbar": {
            "background": "linear-gradient(90deg, var(--base-100), var(--base-200))",
            "box-shadow": "0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          },
          ".wallet-btn": {
            "background": "linear-gradient(135deg, var(--primary), var(--secondary))",
            "color": "var(--base-100)",
            "border": "none",
            "text-shadow": "0 1px 2px rgba(0, 0, 0, 0.2)",
            "transition": "all 0.3s ease",
            "&:hover": {
              "transform": "scale(1.05)",
              "box-shadow": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            },
          },
        },

        night: {
          primary: "#A3A3A3", // Light Gray (for Purple)
          secondary: "#B8B8B8", // Lighter Gray (for Cyan)
          accent: "#D4D4D4", // Pale Gray (for Yellow)
          neutral: "#4B4B4B", // Dark Gray (unchanged)
          "base-100": "#121212", // Near Black (for Dark Blue)
          "base-200": "#1C1C1C", // Darker Gray (for Lighter Dark Blue)
          "base-300": "#2E2E2E", // Medium Dark Gray (for Even Lighter Dark Blue)
          info: "#8C8C8C", // Medium Gray (for Blue)
          success: "#5E5E5E", // Dim Gray (for Green)
          warning: "#787878", // Gray (for Orange)
          error: "#6F6F6F", // Darker Gray (for Red)

          // Night theme overrides  
          ".btn": {
            "border-radius": "0.35rem",
            "font-weight": "500",
            "transition": "all 0.2s ease-in-out",
            "background": "linear-gradient(135deg, var(--neutral), var(--base-300))",
            "border": "1px solid rgba(255,255,255,0.1)",
            "color": "var(--base-100)",
            "text-shadow": "0 1px 2px rgba(0,0,0,0.2)",
            "box-shadow": "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            "&:hover": {
              "background": "linear-gradient(135deg, var(--neutral), var(--base-200))",
              "box-shadow": "0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              "transform": "translateY(-2px)",
            },
            "&:active": {
              "box-shadow": "inset 0 2px 4px 0 rgba(0,0,0,0.06)",
              "transform": "translateY(1px)",
            },
          },
          ".card": {
            "border-radius": "1.5rem",
            "background": "linear-gradient(135deg, var(--base-200), var(--base-300))",
            "border": "1px solid rgba(255,255,255,0.1)",
            "box-shadow": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          },
          ".navbar": {
            "background": "linear-gradient(90deg, var(--base-100), var(--base-200))",
            "border-bottom": "1px solid rgba(255,255,255,0.1)",
          },
          ".wallet-btn": {
            "background": "linear-gradient(135deg, var(--primary), var(--accent))",
            "color": "#FFFFFF",
            "border": "none",
            "transition": "all 0.3s ease",
            "text-shadow": "0 2px 4px rgba(0,0,0,0.2)",
            "&:hover": {
              "transform": "scale(1.05) rotate(2deg)",
              "box-shadow": "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            },
            "&::after": {
              "content": "''",
              "position": "absolute",
              "z-index": "-1",
              "top": "0",
              "left": "0",
              "width": "100%",
              "height": "100%",
              "opacity": "0",
              "border-radius": "0.75rem",
              "background": "linear-gradient(135deg, var(--secondary), var(--primary))",
              "transition": "opacity 0.5s ease",
            },
            "&:hover::after": {
              "opacity": "1",
            },
          },
        },


      }
    ]
  }
}
