import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    commonjsOptions: {
      include: [/react-chartjs-2/, /chart.js/],
    },
    rollupOptions: {
      external: ["react"],
      output: {
        globals: {
          react: "React",
        },
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
});
