import { defineConfig } from 'vite'
import myPlugin from './core/index'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), myPlugin(
    {
      output: '/src/locales/',
    }
  )],
})
