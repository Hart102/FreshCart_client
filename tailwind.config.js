/** @type {import('tailwindcss').Config} */
import { nextui } from "@nextui-org/react";
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        //--------------------
        "deep-gray-50": "#F3F2F4",
        "deep-gray-100": "#C6C6C8",
        "deep-gray-200": "#F7F7F7",
        "deep-gray-300": "#F3F2F4",
        "deep-blue-100": "#007AFF",
        // "deep-green-200": "#10182F",
        // "deep-green-200": "#040028", //unsed

        "deep-red-100": "#FF5757",
        "deep-purple-100": "#8C52FF",
        // "deep-green-50": "#3d4f58",

        // -------------------------
        "deep-green-50": "#ceefce",
        // "deep-green-50": "#066806",
        "deep-green-100": "#044504",
        "deep-green-200": "#1E474E",
        // --------------------------
        "dark-gray-100": "#3d4f58",
        "dark-gray-200": "#f0f3f2",

        overLay: "rgba(0, 0, 0, 0.5)",
      },
    },
  },
  plugins: [nextui()],
};
// 27272A
// 18181B

// Dark blue: #10182F
// dark blue belnder: #262648

// dark-green: 1E474E
// 198754;


// /** @type {import('tailwindcss').Config} */
// // const plugin = require("tailwindcss/plugin");
// const scrollbar = require("tailwind-scrollbar");
// import { nextui } from "@nextui-org/react";

// export default {
//   content: [
//     "./src/**/*.{js,ts,jsx,tsx}",
//     "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
//   ],
//   darkMode: "class",
//   theme: {
//     extend: {
//       colors: {
//         "light-gray-100": "#9CA3A2",
//         "deep-gray-50": "#1E1E1E",
//         "deep-grey-200": "#111111",
//         "deep-dark": "#0d0e0f",
//         "deep-yellow-100": "#FEAB00",
//         "deep-red-100": "#F75368",
//         "deep-blue-50": "#E2E8FF",
//         "deep-blue-100": "#584ADE",
//         "deep-green-50": "#091E29",
//         "deeep-green-100": "#011722",
//         pinkgradient: "rgb(247,114,91)",
//       },
//     },
//   },
//   plugins: [scrollbar({ nocompatible: true }),nextui()],
// };
