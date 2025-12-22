# 🌿 Fresh Harvest Theme Guide

**Project:** Recipe Management Web App  
**Design Philosophy:** Soft, organic, and neutral. This theme uses nature-inspired tones with high-contrast accessibility to ensure the app is functional for both casual browsing and administrative data entry.

---

## 🎨 1. Color Palette Definitions

| Role | Color Name | Hex Code | Tailwind / daisyUI Key |
| :--- | :--- | :--- | :--- |
| **Primary** | Harvest Green | `#4CAF50` | `primary` |
| **Secondary** | Soft Sage | `#8FBC8F` | `secondary` |
| **Accent** | Goldenrod | `#FFC107` | `accent` |
| **Main Text** | Deep Charcoal | `#212121` | `base-content` |
| **Background** | Pure White | `#FFFFFF` | `base-100` |
| **Surface** | Light Cream | `#F7F7F7` | `base-200` |
| **Borders** | Soft Stone | `#DCDCDC` | `base-300` |

### Semantic States (Functional Feedback)
* **Success (`#45A049` - Forest Green):** For "Recipe Saved" notifications.
* **Error (`#E53935` - Soft Tomato):** For "Delete" actions or validation errors.
* **Warning (`#FB8C00` - Dark Amber):** For destructive warnings.
* **Info (`#1E88E5` - Sky Blue):** For helpful tips and instructions.

---

## ⚙️ 2. Configuration (`tailwind.config.js`)

Add this to your configuration to register the theme with **daisyUI v4**.

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
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
          "base-300": "#DCDCDC",         // Borders/Dividers
          "base-content": "#212121",     // Main Text color
          "info": "#1E88E5",
          "success": "#45A049",
          "warning": "#FB8C00",
          "error": "#E53935",
        },
      },
    ],
  },
}
```
## 🛠️ 3. Color Usage Guide
This guide details how to apply the theme to the specific attributes of your Recipe and Ingredient models.

### A. Recipe Model Elements 

- Recipe Title: Use text-base-content with a bold font weight.

- Description (desc): Use text-base-content/70 (70% opacity) for a softer look on the list view.

- Instructions: Use bg-base-100 for the text area and border-base-300 for step-by-step dividers.

- Prep Time (prepTimeMin): Pair with a small clock icon in text-secondary.

- Category: Display as a badge using bg-primary/10 with text-primary.

- Recipe Code: For admin views, use font-mono text-xs text-base-content/50.

### B. Ingredient Model Elements 

- Ingredient Name: Use text-base-content for primary readability.

- Quantity & Unit (qty, unit): Use a smaller font size with text-gray-500 to separate measurements from the name.

- Ingredient Table (Admin Management):

- Header Row: Use bg-base-200.

- Alternate Rows: Use bg-base-100 and bg-base-200 to help visual scanning.

### C. Global Components
- Primary Action (Save/Add): Use .btn-primary (Green).

- High Priority CTA (Create Recipe): Use .btn-accent (Gold).

- Recipe Cards: Use bg-base-200 with a subtle shadow to stand out against the base-100 background.

- Forms/Inputs: Use bg-base-100 with border-base-300 and focus:border-primary.

## 💡 Implementation Tips
- Softness without Gray: This theme uses Light Cream (#F7F7F7) and Soft Stone (#DCDCDC) instead of standard cold grays to keep the interface warm.

- Contrast Compliance: Buttons using the Accent (Gold) color are configured with dark text (#212121) to ensure accessibility.

- Dynamic Tints: Use Tailwind’s slash syntax (e.g., bg-primary/20) to create soft backgrounds for highlights or success alerts without adding new hex codes.