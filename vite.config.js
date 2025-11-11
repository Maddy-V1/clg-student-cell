import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // Allows setting base path for GitHub Pages.
    // The GitHub Action sets VITE_BASE to "/<repo-name>/" automatically.
    base: env.VITE_BASE || '/',
    plugins: [react()],
    server: {
      port: 3000,
      open: true
    }
  }
})

