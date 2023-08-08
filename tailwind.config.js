/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      colors: {
        'equator': {
          '50': 'hsl(47, 70%, 96%)',
          '100': 'hsl(49, 68%, 89%)',
          '200': 'hsl(49, 70%, 77%)',
          '300': 'hsl(47, 69%, 63%)',
          '400': 'hsl(44, 69%, 56%)',
          '500': 'hsl(39, 66%, 50%)',
          '600': 'hsl(33, 68%, 44%)',
          '700': 'hsl(27, 65%, 37%)',
          '800': 'hsl(24, 59%, 31%)',
          '900': 'hsl(22, 56%, 26%)',
          '950': 'hsl(23, 67%, 14%)',
        },

      }
    },
  },
  plugins: [],
}

