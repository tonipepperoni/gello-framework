/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Gruvbox dark palette
        gruvbox: {
          bg: {
            DEFAULT: '#282828',
            hard: '#1d2021',
            soft: '#32302f',
            1: '#3c3836',
            2: '#504945',
            3: '#665c54',
            4: '#7c6f64',
          },
          fg: {
            DEFAULT: '#ebdbb2',
            0: '#fbf1c7',
            1: '#ebdbb2',
            2: '#d5c4a1',
            3: '#bdae93',
            4: '#a89984',
          },
          gray: '#928374',
          red: {
            DEFAULT: '#fb4934',
            dim: '#cc241d',
          },
          green: {
            DEFAULT: '#b8bb26',
            dim: '#98971a',
          },
          yellow: {
            DEFAULT: '#fabd2f',
            dim: '#d79921',
          },
          blue: {
            DEFAULT: '#83a598',
            dim: '#458588',
          },
          purple: {
            DEFAULT: '#d3869b',
            dim: '#b16286',
          },
          aqua: {
            DEFAULT: '#8ec07c',
            dim: '#689d6a',
          },
          orange: {
            DEFAULT: '#fe8019',
            dim: '#d65d0e',
          },
        },
      },
    },
  },
  plugins: [],
};
