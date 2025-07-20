import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import compression from "vite-plugin-compression";

export default defineConfig({
  plugins: [
    react(),

    // ✅ Enables gzip or brotli compression
    compression({
      algorithm: "brotliCompress", // or 'gzip'
      ext: ".br",
      threshold: 1024,
      deleteOriginFile: false,
    }),

    // ✅ Optional: Makes your site installable as a PWA
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "KONET",
        short_name: "KONET",
        start_url: "/",
        display: "standalone",
        background_color: "#FFFFFF",
        theme_color: "#43a047",
        icons: [
          {
            src: "/logo2-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/logo2-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],

  base: "./",

  build: {
    minify: "esbuild", // fast & efficient
    sourcemap: false,
    outDir: "dist",
    rollupOptions: {
      output: {
        manualChunks(id) {
          // ✅ Splits large node_modules into separate chunks
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
      },
    },
  },

  optimizeDeps: {
    include: ["react", "react-dom"],
  },
});
