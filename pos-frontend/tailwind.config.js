/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-bg": "#111315",
        "custom-bg-2": "#292C2D",
        "custom-pink": "#FAC1D9",
        "custom-input-bg": "#3D4142",
        "custom-desc-color": "#ADADAD",
        "custom-text-color": "#777979",
        "custom-border-color": "#5E5E5E",
        "custom-orderStatus-bg-ready": "#E3FFE4",
        "custom-orderStatus-bg-completed": "#B2E8FF",
        "custom-orderStatus-bg-cancelled": "#FFC3C3",
        "custom-orderStatus-bg-pending": "#FFEDBE",
      },
      boxShadow: {
        custom: "0px 0px 8px -3px rgba(255, 255, 255, 254.5)",
      },
      border: {
        custom: "1px",
      },
    },
  },
  plugins: [],
};
