/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        day: {
          primary: "#FF5A5F",
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
          "*": {
            "font-family": "'Poppins', sans-serif",
          },
          ".btn": {
            "border-radius": "0.5rem",
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
          primary: "#8B5CF6", // Purple
          secondary: "#22D3EE", // Cyan
          accent: "#FBBF24", // Yellow
          neutral: "#4B5563", // Gray
          "base-100": "#111827", // Dark blue
          "base-200": "#1F2937", // Lighter dark blue 
          "base-300": "#374151", // Even lighter dark blue
          info: "#3B82F6", // Blue
          success: "#10B981", // Green
          warning: "#F59E0B", // Orange
          error: "#EF4444", // Red

          // Night theme overrides  
          "*": {
            "font-family": "'Inter', sans-serif",
          },
          ".btn": {
            "border-radius": "0.75rem",
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
