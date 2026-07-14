import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Dedicated, fixed port for the web dashboard. Without this, Vite defaults
    // to 5173 and collides with expo-mobile-app (which also defaults to 5173),
    // so the port would drift unpredictably and the landing page's "Sign in"
    // link (VITE_WEB_APP_URL) could not reliably reach the dashboard.
    // strictPort makes a conflict fail loudly instead of silently drifting.
    port: 5180,
    strictPort: true,
  },
});
