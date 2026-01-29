/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,jsx}',
        './components/**/*.{js,jsx}',
    ],
    theme: {
        extend: {
            colors: {
                background: '#111111',
                primary: '#E63946', // Red/Pink accent
                secondary: '#f1faee',
                text: '#ffffff',
                muted: '#A8A8A8',
            },
            fontFamily: {
                sans: ['var(--font-inter)'],
                display: ['var(--font-oswald)'],
            },
        },
    },
    plugins: [],
}
