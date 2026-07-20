/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F4F6FE',
        ink: '#12114E',
        muted: '#5A5F8C',
        line: '#E2E6F7',
        peri: '#5850E0',
        blue: {
          DEFAULT: '#0045DF',
          deep: '#18189C',
          bright: '#2E6BFF',
        },
      },
      fontFamily: {
        disp: ['"Archivo Black"', 'sans-serif'],
        body: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        card: '0 14px 34px -14px rgba(24,24,156,.16)',
        soft: '0 6px 18px -12px rgba(24,24,156,.12)',
        lift: '0 30px 70px -30px rgba(0,0,0,.5)',
      },
    },
  },
  plugins: [],
}
