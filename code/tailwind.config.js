export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,html}"],
    theme: {
        extend: {
            colors: {
                blue: {
                    600: "#2563eb",
                    800: "#1e3a8a",
                },
            },
        },
    },
    plugins: [require('@tailwindcss/typography')],
};
