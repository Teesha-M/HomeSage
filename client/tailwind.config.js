/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes:{
        pulseSlow:{
          '0%': { transform: 'scale(1)', opacity: '0.5' },
          '50%': { transform: 'scale(1.1)', opacity: '0.2' },
          '100%': { transform: 'scale(1)', opacity: '0.5' },
        },
      },
    },
  },
  animation: {
    'pulse-slow': 'pulseSlow 5s infinite',
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    // ...
  ],
};