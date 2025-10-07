import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "75.119.138.163",
    // host : "10.10.7.48",
    port: 3004,
  },
});
