// tailwind.config.js
export const content = [
  "./src/**/*.{js,jsx,ts,tsx}", // Ensure the path matches your source files
];
export const theme = {
  extend: {
    keyframes: {
      fadeIn: {
        "0%": { opacity: "0" },
        "100%": { opacity: "1" },
      },
    },
    animation: {
      "fade-in": "fadeIn 0.3s ease-in-out",
    },
    colors: {
      primary: "#0A2647", // For headers and primary areas
      secondary: "#FFFFFF", // For backgrounds and main text areas
      gray: "#F4F4F8", // For dividers or soft backgrounds
      accent: "#FF6B00", // For call-to-action elements
    },
  },
};
export const plugins = [];
