/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#007BFF',
        secondary: '#28A745',
        background: '#F8F9FA',
        completed: '#6c757d',
        progress: '#007BFF',
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        'fade-in': 'fadeIn 1s ease-out forwards',
        glowIn: 'glowIn 1s ease-out forwards',
      },
      keyframes: {
        float: {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
          "100%": { transform: "translateY(0px)" },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(-20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        glowIn: {
          '0%': { opacity: 0, transform: 'scale(0.95)', boxShadow: '0 0 0px transparent' },
          '100%': {
            opacity: 1,
            transform: 'scale(1)',
            boxShadow: '0 0 25px rgba(0, 123, 255, 0.4)',
          },
        },
      },
  },
  safelist: [
    "animate-float",
    "animate-fade-in"

  ],
  plugins: [],
}}
