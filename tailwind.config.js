/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte}"],
  theme: {
    extend: {
      fontFamily: {
        'noto': ['Noto Sans KR:400,700', 'sans-serif'],
      },
      aspectRatio: {
        '1/3': '1 / 3',
        '2/3': '2 / 3',
        '45/32': '45 / 32',  // 2x6 landscape
        '4/3': '4 / 3',  // 4:3 landscape
        '3/4': '3 / 4',  // 4:3 portrait
        '16/9': '16 / 19', // 16:9 landscape
        '9/16': '9 / 16', // 16:9 portrait
      }
    },
  },
  plugins: [],
}

