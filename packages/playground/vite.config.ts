import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import a2k from '@a2k/core'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), a2k({})],
})
