import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/v2/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@spektra/components': path.resolve(__dirname, '../../sp-platform/packages/components/src/index.ts'),
      '@spektra/layouts': path.resolve(__dirname, '../../sp-platform/packages/layouts/src/index.ts'),
      '@spektra/types': path.resolve(__dirname, '../../sp-platform/packages/types/src/index.ts'),
    },
  },
  server: {
    port: 5174,
  },
}))
