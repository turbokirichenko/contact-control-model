import { defineConfig } from 'vite'

export default defineConfig({
  server: { port: 5173 },
  build: { outDir: 'docs', sourcemap: true }
})