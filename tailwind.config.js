/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        violetBg: "#097CAD",
        violetTxt: "#3292BB",
        highLightBg: "#EFF6FF",
        placeholder: "#667085",
        helperText: "#667085",
        toolPalette: "#F2F4F7",
        canvasBg: "#F8FAFD",
        samHighlight: "#FF474C",
        samCutOutBorder: "#eea9ac",
      },
    },
  },
  plugins: [],
}
