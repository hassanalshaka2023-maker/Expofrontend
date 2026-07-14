import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    // Landing page runs on its own port. The dashboard is pinned to 5180 and
    // expo-mobile-app uses the default 5173, so 5174 keeps all three distinct.
    port: 5174,
  },
});
