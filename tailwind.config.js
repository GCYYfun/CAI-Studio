/**
 * Tailwind CSS 配置文件
 * 为 CAI Game Studio 项目配置 Tailwind CSS
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './src/app.html'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f1ff',
          100: '#b3d9ff',
          500: '#64ffda',
          900: '#0a192f',
        },
        secondary: {
          900: '#112240',
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'Open Sans',
          'Helvetica Neue',
          'sans-serif'
        ]
      }
    },
  },
  plugins: [],
}
