import type { Config } from 'tailwindcss';

export const tailwindColors = {
  white: '#fff',
  black: '#000',
  blackLight: '#343a40',
  error: {
    DEFAULT: '#ff0000',
    100: '#ffe3e3',
    200: '#ffaaaa',
    300: '#ff7171',
    400: '#ff3939',
    500: '#ff0000',
    600: '#c60000',
    700: '#8e0000',
    800: '#550000',
    900: '#1c0000',
  },

  // custom colors
  success: {
    DEFAULT: '#00ff00',
    100: '#e3ffe3',
    200: '#aaffaa',
    300: '#71ff71',
    400: '#39ff39',
    500: '#00ff00',
    600: '#00c600',
    700: '#008e00',
    800: '#005500',
    900: '#001c00',
  },
  errorDark: {
    DEFAULT: '#b20000',
  },
  main: {
    DEFAULT: '#F03ED7',
    100: '#fde5fa',
    200: '#f9b0ef',
    300: '#f57ce4',
    400: '#f147d9',
    500: '#ed12ce',
    600: '#b80ea0',
    700: '#830a72',
    800: '#4f0645',
    900: '#1a0217',
  },
  mainDark: '#d837c1',
  lightGray: '#EBEBEB',
  gray: {
    DEFAULT: '#9E9D9D',
    100: '#f1f1f1',
    200: '#d5d4d4',
    300: '#b9b8b8',
    400: '#9c9b9b',
    500: '#807f7f',
    600: '#646363',
    700: '#474646',
    800: '#2b2a2a',
    900: '#0e0e0e',
  },
};

export const tailwindBreakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export const tailwindConfig: Config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    '!./node_modules',
  ],
  theme: {
    colors: tailwindColors,
  },
  plugins: [],
  important: true,
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
