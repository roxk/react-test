/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors');

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      ...colors,
      "main-bg": "#f1f0ee",
      "table-header": "#FFFAE5",
      "table-row": "#FFFFFF",
      "dropdown-border": "#c9cdd4",
      "input-border": "#f5f5f5",
      "header-text": "#555555",
      "dropdown-text": "#6b7785",
      "primary": "#ffd000",
      "alert": "#FF0f0f",
      "disabled": "#ABA79e"
    }
  },
  plugins: [],
}

