/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "custom-bg" : "#111315",
        "custom-bg-2" : "#292C2D",
        "custom-pink" : "#FAC1D9",
        "custom-input-bg" : "#3D4142",
        "custom-desc-color" : "#ADADAD"
      },
      boxShadow: {
        'custom': '0px 0px 8px -3px rgba(255, 255, 255, 254.5)',
      },
    },
    
  },
  plugins: [],
}

