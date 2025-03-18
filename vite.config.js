import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ["react-chartjs-2", "chart.js"],
      output: {
        globals: {
          "react-chartjs-2": "ReactChartjs2",
          "chart.js": "Chart",
        },
      },
    },
  },
});
