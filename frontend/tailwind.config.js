/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Manrope', 'sans-serif'],
                display: ['Cinzel', 'serif'],
            },
            colors: {
                gold: {
                    400: '#FACC15',
                    500: '#EAB308',
                    600: '#CA8A04',
                }
            },
        },
    },
    plugins: [],
}
