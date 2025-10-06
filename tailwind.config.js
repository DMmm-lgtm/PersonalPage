/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00FFFF', // 电光蓝/青色
          light: '#33FFFF',   // 浅青色
          dark: '#00CCCC',    // 深青色
        },
        secondary: {
          DEFAULT: '#000000', // 黑色
          light: '#333333',   // 浅黑色
        },
        accent: '#FFFFFF',    // 白色强调
      },
      fontFamily: {
        'display': ['Inter', 'sans-serif'], // 标题字体
        'mono': ['Fira Code', 'monospace'], // 等宽字体
      },
    },
  },
  plugins: [],
}
