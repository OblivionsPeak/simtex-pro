import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // CRITICAL for Electron to find assets
  plugins: [
    react(),
    electron([
      {
        // Main-process entry file of the Electron App.
        entry: 'electron/main.js',
      },
      {
        entry: 'electron/preload.js',
        onstart(options) {
          // Notify the Renderer-process to reload the page when the Preload-Script build is complete, 
          // instead of restarting the entire Electron App.
          options.reload()
        },
      },
    ]),
    renderer(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
