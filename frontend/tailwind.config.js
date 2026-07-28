/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#1c1c1e',
        surface2: '#2c2c2e',
        surface3: '#3a3a3c',
        line: 'rgba(255,255,255,.12)',
        muted: '#8e8e93',
        muted2: '#636366',
        card: '#222222',
        'card-alt': '#1F1F1F',
        'card-border': '#353535',
        'card-hover': '#303030',
        'card-muted': '#8F8F8F',
        stat: '#252525',
        'stat-border': '#3A3A3A',
        'stat-muted': '#9A9A9A',
        selected: '#F5F5F5',
      },
    },
  },
  plugins: [],
};
