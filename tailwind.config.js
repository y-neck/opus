/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Files to include in the build
    "./pages/**/*.{vue,js,jsx,html}",
    "./layouts/**/*.{vue,js,jsx,html}",
    "./components/**/*.{vue,js,jsx,html}",
    "./src/**/*.{vue,js,jsx,html}",
    "./public/**/*.{vue,js,jsx,html}",
  ],
  theme: {
    fontWeight: {
      normal: "360",
      semiBold: "560",
    },
    colors: {
      // Colors
      white: "#ffffff",
      black: "#000000",
      grey: {
        50: "#fafafa",
        100: "#f4f4f5",
        200: "#e4e4e7",
        300: "#d4d4d8",
        400: "#a1a1aa",
        500: "#71717a",
        600: "#52525b",
        700: "#3f3f46",
        800: "#27272a",
        900: "#18181b",
        950: "#09090b",
      },
      destructive: {
        red: "#CF3636",
        darkRed: "#B12222",
      },
    },
    screens: {
      // Screen Breakpoints
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
  },
  extend: {
    fontFamily: {
      sans: ["Pretendard", "sans-serif"],
    },
  },
  atDirectives: [
    {
      name: "@apply",
      description:
        "Use the `@apply` directive to inline any existing utility classes into your own custom CSS.",
      references: [
        {
          name: "Tailwind Documentation",
          url: "https://tailwindcss.com/docs/functions-and-directives#apply",
        },
      ],
    },
  ],
};
