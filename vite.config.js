import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dotenv from "dotenv";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    "process.env.VITE_API_KEY": JSON.stringify(
      dotenv.config().parsed.VITE_API_KEY
    ),
    "process.env.VITE_AUTH_DOMAIN": JSON.stringify(
      dotenv.config().parsed.VITE_AUTH_DOMAIN
    ),
    "process.env.VITE_PROJECT_ID": JSON.stringify(
      dotenv.config().parsed.VITE_PROJECT_ID
    ),
    "process.env.VITE_STORAGE_BUCKET": JSON.stringify(
      dotenv.config().parsed.VITE_STORAGE_BUCKET
    ),
    "process.env.VITE_MESSAGING_SENDER_ID": JSON.stringify(
      dotenv.config().parsed.VITE_MESSAGING_SENDER_ID
    ),
    "process.env.VITE_APP_ID": JSON.stringify(
      dotenv.config().parsed.VITE_APP_ID
    ),
    "process.env.VITE_MEASUREMENT_ID": JSON.stringify(
      dotenv.config().parsed.VITE_MEASUREMENT_ID
    ),
  },
});
