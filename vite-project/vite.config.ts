


import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import checker from "vite-plugin-checker";

export default defineConfig({
  plugins: [
    react(),
    process.env.NODE_ENV === "development" && checker({ typescript: true }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
