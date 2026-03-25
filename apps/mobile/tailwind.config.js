/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6F7F7',
          100: '#B3EBEB',
          200: '#80DEDE',
          300: '#4DD1D1',
          400: '#26C6C6',
          500: '#00A8A8',
          600: '#008B8B',
          700: '#006D6D',
          800: '#054752',
          900: '#032E36',
        },
        success: {
          50: '#ECFDF5',
          500: '#10B981',
          700: '#047857',
        },
        warning: {
          50: '#FFFBEB',
          500: '#F59E0B',
          700: '#B45309',
        },
        danger: {
          50: '#FEF2F2',
          500: '#EF4444',
          700: '#B91C1C',
        },
        info: {
          50: '#EFF6FF',
          500: '#3B82F6',
        },
      },
      borderRadius: {
        card: '12px',
        button: '8px',
        chip: '20px',
      },
      spacing: {
        'screen-x': '16px',
        'screen-y': '24px',
        card: '16px',
      },
    },
  },
  plugins: [],
};
