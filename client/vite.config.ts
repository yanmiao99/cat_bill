import vue from '@vitejs/plugin-vue'
import {defineConfig} from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'

// @ts-ignore
import path from 'path'

// @ts-ignore
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/element.scss" as *;`,
      },
    },
  },
  server: {
    host: 'localhost', // 启动时使用的路径 localhost
    port: 8080, // 指定端口号
    open: '/', // 启动打开页面
    proxy: {
      '/api': {
        target: 'http://localhost:3000'
      }
    }
  },
  plugins: [
    vue({}),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      dts: 'types/auto-imports.d.ts',
      imports: ['vue'],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      // 指定扫描组件库的路径
      dirs: ['src/components'],
      // 自动导入组件库
      extensions: ['vue'],
      // 指定文件
      dts: 'types/components.d.ts',
    }),
  ],
})
