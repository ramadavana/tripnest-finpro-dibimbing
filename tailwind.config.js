/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeInOut: {
          "0%": { opacity: "0", transform: "translate(-50%, -30%)" },
          "5%": { opacity: "1", transform: "translate(-50%, -50%)" },
          "95%": { opacity: "1", transform: "translate(-50%, -50%)" },
          "100%": { opacity: "0", transform: "translate(-50%, -70%)" },
        },
      },
      animation: {
        fadeInOut: "fadeInOut 3s ease-in-out",
      },
      zIndex: {
        "most-front": 9999,
        "most-front-2nd": 9998,
        "most-front-3rd": 9997,
        "most-front-4th": 9996,
        "most-front-5th": 9995,
        "most-front-6th": 9994,
        "most-front-7th": 9993,
        "most-front-8th": 9992,
        "most-front-9th": 9991,
        "most-front-10th": 9990,
        "most-front-11th": 9989,
        "most-front-12th": 9988,
        "most-front-13th": 9987,
        "most-front-14th": 9986,
        "most-front-15th": 9985,
        "most-front-16th": 9984,
        "most-front-17th": 9983,
        "most-front-18th": 9982,
        "most-front-19th": 9981,
        "most-front-20th": 9980,
      },
    },
  },
  plugins: [],
};
