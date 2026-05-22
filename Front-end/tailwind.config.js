/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1B4332',
          light:   '#2D6A4F',
          dark:    '#081C15',
        },
        accent: {
          DEFAULT: '#52B788',
          light:   '#95D5B2',
          dark:    '#40916C',
        },
        energy: {
          DEFAULT: '#F77F00',
          light:   '#FCBF49',
          dark:    '#D62828',
        },
        surface: {
          DEFAULT: '#F8FAF9',
          muted:   '#E9F0EB',
        },
        ink: {
          DEFAULT: '#1A1A2E',
          muted:   '#4A5568',
        },
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        xl:  '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        card:  '0 4px 24px 0 rgba(27, 67, 50, 0.10)',
        hover: '0 8px 32px 0 rgba(27, 67, 50, 0.18)',
      },
    },
  },
  plugins: [],
}
