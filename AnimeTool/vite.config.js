import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

const uniPlugin = uni.default || uni

export default defineConfig({
  plugins: [uniPlugin()]
})
