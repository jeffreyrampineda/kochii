/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      screens: {
        sm: "480px",
        md: "768px",
        lg: "976px",
        xl: "1440px",
      },
      colors: {
        primary: "#1c2331",
        "primary-dark": "#161c27",
        skyblue: "#45cafc",
        navyblue: "#303f9f",
      },
    },
  },
  plugins: [],
};
