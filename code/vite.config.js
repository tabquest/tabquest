import { defineConfig } from "vite";

export default defineConfig({
    build: {
        exclude: ["manifest.json", "images/*"], // file paths you want to exclude
    },
});
