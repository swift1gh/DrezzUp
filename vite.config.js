import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      external: [],
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("firebase")) return "firebase";
            if (id.includes("react")) return "react";
            if (id.includes("@mui")) return "mui";
            if (id.includes("chart")) return "chart";
            return "vendor";
          }
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ["react-floater"],
  },
});
