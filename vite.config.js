import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/PowMie/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'PowMie Pomodoro',
        short_name: 'PowMie',
        description: 'A cute Pomodoro timer',
        theme_color: '#f43f5e',
        background_color: '#fff1f2',
        display: 'standalone'
      }
    })
  ]
});
