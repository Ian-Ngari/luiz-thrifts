/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        rose:    "#C4877D",
        blush:   "#F5E8E4",
        "blush-mid": "#EDD3CC",
        "border-rose": "#E0C0B8",
        dark:    "#1C1412",
        mid:     "#7A5F5A",
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "serif"],
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%":   { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up":   "fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both",
        "slide-up":  "slideUp 0.4s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};
