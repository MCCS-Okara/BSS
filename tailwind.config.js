/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/views/**/*.ejs", "./src/views/script/**/*.js"],
  theme: {
      extend: {
        spacing: {
          '7': '10rem', // Example: Custom size for width and height
        },
    },

  },
  plugins: [],
}