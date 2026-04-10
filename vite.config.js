import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/PwoMie/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      includeAssets: ['**/*.svg', '**/*.png', '**/*.ico'],
      manifest: {
        name: 'PwoMie Pomodoro',
        short_name: 'PwoMie',
        description: 'A cute Pomodoro timer by Rohan Villoth',
        theme_color: '#f43f5e',
        background_color: '#fff1f2',
        display: 'standalone',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: 'icon-monochrome.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'monochrome'
          },
          {
            src: 'web-app-manifest-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'web-app-manifest-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
