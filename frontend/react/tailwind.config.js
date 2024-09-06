/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        sans: 'Inter',
      },
      boxShadow:{
        shape: '8px 8px 8px rgba(0, 0, 0, 0.8), /* Dark shadow */8px 4px 4px rgba(0, 0, 0, 0.6), /* Medium shadow */8px 2px 2px rgba(0, 0, 0, 0.4), /* Light shadow */8px 8px 8px 1px rgba(0, 0, 0, 0.8), /* Dark shadow with spread */inset 8px 8px 8px 1px rgba(50, 50, 50, 0.5), /* Inset shadow with gray */inset 8px 1px 8px rgba(50, 50, 50, 0.3);'

      },
      backgroundImage:{
        pattern: 'url(/bg.png)'
      },
    },
  },
  plugins: [],
}

