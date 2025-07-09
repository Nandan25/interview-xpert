// tailwind.config.js
export const content = [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
    extend: {
        fontFamily: {
            sans: ['Inter', 'sans-serif'],
        },
        colors: {
            primary: '#ff6a00',
            // Add your branding colors if needed
        },
    },
};
export const plugins = [];
