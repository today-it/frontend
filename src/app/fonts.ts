import localFont from 'next/font/local';

export const astaSans = localFont({
  src: './fonts/AstaSans-VariableFont_wght.ttf',
  variable: '--font-asta-sans',
  display: 'swap',
  style: 'normal',
  weight: '300 800',
  fallback: ['Arial', 'sans-serif'],
});
