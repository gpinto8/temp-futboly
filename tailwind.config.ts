import type { Config } from 'tailwindcss';

export const tailwindConfig: Config = {
  content: ['./components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],

  // do the sizes

  theme: {
    colors: {
      white: '#fff', // generic colors
      black: '#000',
      blackLight: '#343a40',
      error: '#ff0000', // custom colors
      success: '#00ff00',
      errorDark: '#b20000',
      main: '#F03ED7',
      mainDark: '#d837c1',
      lightGray: '#EBEBEB',
      gray: '#9E9D9D',
    },
  },
  plugins: [],
  // important: true,
  mode: 'jit',
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
};

export default tailwindConfig;
