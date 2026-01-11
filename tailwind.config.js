/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,svelte,ts}'
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Roboto", "sans-serif"],
        'display': ["Poppins", "sans-serif"],
        'body': ["Roboto", "sans-serif"]
      }
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        freshHarvest: {
          "primary": "#4CAF50",          // Harvest Green
          "primary-content": "#ffffff",
          "secondary": "#8FBC8F",        // Soft Sage
          "secondary-content": "#212121",
          "accent": "#FFC107",           // Goldenrod
          "accent-content": "#212121",
          "neutral": "#212121",          // Deep Charcoal
          "neutral-content": "#ffffff",
          "base-100": "#FFFFFF",         // Background
          "base-200": "#F7F7F7",         // Surface/Cards
          "base-300": "#DCDCDC",         // Borders/Dividers, soft-stone
          "base-content": "#212121",     // Main Text color
          "info": "#1E88E5",
          "success": "#45A049",
          "warning": "#FB8C00",
          "error": "#E53935",

          // Injecting fonts directly into the daisyUI theme variables
          // "--font-family-display": "Quicksand, sans-serif",
        },
      },
    ],
  },
}

