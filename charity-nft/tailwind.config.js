/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class', // active le mode dark via une classe (tu pourras le basculer dynamiquement)
    content: [
      "./src/**/*.{js,ts,jsx,tsx}",
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
      extend: {
        // Tu peux ajouter ici tes couleurs ou autres personnalisations
      },
    },
    plugins: [],
  };
  