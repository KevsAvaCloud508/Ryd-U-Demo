/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta del tema oscuro definida
        surface: '#1c1c1e',
        surface2: '#2c2c2e',
        surface3: '#3a3a3c',
        line: 'rgba(255,255,255,.12)',
        muted: '#8e8e93',
        muted2: '#636366',
      },
    },
  },
  plugins: [],
};
