import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import liveReload from 'vite-plugin-live-reload'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      svelte(),
      liveReload([
          './public/**/*',
          './src/**/*',
      ])
  ],
})
