import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
    plugins: [react()],
    build: {
        exclude: ["manifest.json", "images/*"], // file paths you want to exclude
    },
});
