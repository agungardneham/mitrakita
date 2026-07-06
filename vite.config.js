import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Base path untuk deployment
  base: "/",

  plugins: [react(), tailwindcss()],

  define: {
    "process.env.VITE_API_KEY": JSON.stringify(process.env.VITE_API_KEY),
    "process.env.VITE_AUTH_DOMAIN": JSON.stringify(
      process.env.VITE_AUTH_DOMAIN,
    ),
    "process.env.VITE_PROJECT_ID": JSON.stringify(process.env.VITE_PROJECT_ID),
    "process.env.VITE_STORAGE_BUCKET": JSON.stringify(
      process.env.VITE_STORAGE_BUCKET,
    ),
    "process.env.VITE_MESSAGING_SENDER_ID": JSON.stringify(
      process.env.VITE_MESSAGING_SENDER_ID,
    ),
    "process.env.VITE_APP_ID": JSON.stringify(process.env.VITE_APP_ID),
    "process.env.VITE_MEASUREMENT_ID": JSON.stringify(
      process.env.VITE_MEASUREMENT_ID,
    ),
    "process.env.VITE_SUPABASE_URL": JSON.stringify(
      process.env.VITE_SUPABASE_URL,
    ),
    "process.env.VITE_SUPABASE_KEY": JSON.stringify(
      process.env.VITE_SUPABASE_KEY,
    ),
    "process.env.VITE_GEMINI_API_KEY": JSON.stringify(
      process.env.VITE_GEMINI_API_KEY,
    ),
    "process.env.VITE_ADMIN_USERNAME": JSON.stringify(
      process.env.VITE_ADMIN_USERNAME,
    ),
    "process.env.VITE_ADMIN_PASSWORD_HASH": JSON.stringify(
      process.env.VITE_ADMIN_PASSWORD_HASH,
    ),
  },

  // Konfigurasi Build untuk optimasi asset loading
  build: {
    // Strategi code splitting untuk performance
    rollupOptions: {
      output: {
        // Folder struktur output yang jelas
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",

        // Optimasi chunk splitting
        manualChunks: {
          react: ["react", "react-dom"],
          supabase: ["@supabase/supabase-js"],
          charts: ["recharts"],
          utils: ["axios", "crypto-js"],
        },
      },
    },

    // Optimasi CSS
    cssCodeSplit: true,
    cssMinify: true,
    minify: "terser",

    // Manifest untuk asset versioning
    manifest: true,

    // Report compressed size
    reportCompressedSize: false,

    // Chunk size warning
    chunkSizeWarningLimit: 500,
  },

  // Konfigurasi Server untuk development
  server: {
    // CORS handling
    cors: true,

    // Host binding
    host: "0.0.0.0",
    port: 5173,

    // Middleware untuk header asset
    middlewareMode: false,

    // File watching
    watch: {
      usePolling: false,
    },

    // Headers untuk cross-browser compatibility
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Access-Control-Allow-Origin": "*",
    },
  },

  // Konfigurasi Preview untuk production build
  preview: {
    port: 4173,
    strictPort: false,
  },

  // Asset handling
  assetsInclude: [
    "**/*.svg",
    "**/*.png",
    "**/*.jpg",
    "**/*.jpeg",
    "**/*.gif",
    "**/*.webp",
    "**/*.woff",
    "**/*.woff2",
  ],
});
