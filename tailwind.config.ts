/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}", // ✅ Includes pages in App Router
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}", // ✅ Includes components
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}", // ✅ (Optional) If you have a `pages/` directory
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
