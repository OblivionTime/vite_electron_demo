import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
import { resolve } from 'path' // path 模块提供了一些工具函数，用于处理文件与目录的路径
const pathResolve = (path) => resolve(process.cwd(), path)

export default defineConfig({
    plugins: [
        vue(),
        electron({
            // 主进程入口文件
            entry: './main/background.js'
        })
    ],
    resolve: {
        alias: {
            '@': pathResolve('src'), // 设置 `@` 指向 `src` 目录
        }
    },
    /*开发服务器选项*/
    server: {
        // 端口
        port: 3000,
    }
})