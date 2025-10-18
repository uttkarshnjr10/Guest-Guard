/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%': { transform: 'translateY(20px) translateX(-10px) rotate(0deg)' },
          '100%': { transform: 'translateY(-20px) translateX(10px) rotate(10deg)' },
        },
      },
      animation: {
        float: 'float 20s infinite alternate',
        'float-slow': 'float 25s infinite alternate',
      },
    },
  },
  plugins: [],
};