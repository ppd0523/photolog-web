/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte}"],
  theme: {
    extend: {
      fontFamily: {
        'noto': ['Noto Sans KR:400,700', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

