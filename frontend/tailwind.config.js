// tailwind.config.js
export default {
  darkMode: "class", // 🔥 ahora sí depende de la clase .dark en <html>
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}