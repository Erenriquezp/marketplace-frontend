/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}', // Asegura que Tailwind procese todos los archivos Angular
  ],
  theme: {
    extend: {
      colors: {
        primary: '#d3435b',
        secondary: '#721652',
        button: '#420054',
        footer: '#420054',
      },
    },
  },
  plugins: [],
}

