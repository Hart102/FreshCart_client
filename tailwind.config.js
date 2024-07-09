/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
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
  plugins: [],
};
// 27272A
// 18181B

// Dark blue: #10182F
// dark blue belnder: #262648

// dark-green: 1E474E
// 198754;