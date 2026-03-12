/** @type {import('tailwindcss').Config} */

import Color from 'color'

const generateColorScale = (base) => {
  const c = Color(base);
  return {
    100: c.mix(Color("white"), 0.85).hex(),   // background
    200: c.mix(Color("white"), 0.7).hex(),    // hover background
    300: c.mix(Color("white"), 0.5).hex(),   // border
    400: c.mix(Color("white"), 0.3).hex(),    // hover border
    500: base,                    // main color
    600: c.mix(Color("black"), 0.15).hex(),     // text
    700: c.mix(Color("black"), 0.25).hex(),
    800: c.mix(Color("black"), 0.35).hex()
  }
}

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
      },
      colors: {
        success: generateColorScale("#45A049"),
        error: generateColorScale("#E53935"),
        info: generateColorScale("#1E88E5"),
        warning: generateColorScale("#FB8C00"),
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

