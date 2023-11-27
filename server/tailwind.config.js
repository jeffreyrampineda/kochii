/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{pug,html,js}"],
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
      backgroundSize: {
        "75%": "75%",
      },
    },
  },
  plugins: [],
};
