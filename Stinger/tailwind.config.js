/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      screens: {
        'xxs': '100px',
        'xs': '320px',
        'sm': '640px',  
        'md': '1024px',
        'lg': '1280px',  
        'xl': '1536px',
        '2xl': '1920px'
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
