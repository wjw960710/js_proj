import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html'),
        client: resolve(__dirname, 'client.html'),
      },
    },
  },
  plugins: [
    react(),
    {
      name: 'request-intercept',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url || '/';
          // 使用 new URL(url, 'http://localhost') 提取 pathname，確保正確處理查詢參數
          const pathname = new URL(url, 'http://localhost').pathname;

          if (pathname === '/' || pathname === '/index.html') {
            // 空實現：主要入口路徑不添加 X-Tag
          } else if (pathname === '/admin' || pathname === '/admin.html') {
            // 空實現
          } else if (pathname === '/client' || pathname === '/client.html') {
            // 空實現
          } else {
            // 為非主要入口請求加上 X-Tag: test 標頭
            res.setHeader('X-Tag', 'test');
          }
          next();
        });
      },
      configurePreviewServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url || '/';
          // 使用 new URL(url, 'http://localhost') 提取 pathname
          const pathname = new URL(url, 'http://localhost').pathname;

          if (pathname === '/' || pathname === '/index.html') {
            // 空實現
          } else if (pathname === '/admin' || pathname === '/admin.html') {
            // 空實現
          } else if (pathname === '/client' || pathname === '/client.html') {
            // 空實現
          } else {
            // 為非主要入口請求加上 X-Tag: test 標頭
            res.setHeader('X-Tag', 'test');
          }
          next();
        });
      }
    },
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      injectManifest: {
        injectionPoint: undefined,
      },
      injectRegister: 'auto',
      scope: '/',
      devOptions: {
        enabled: true,
        type: 'module',
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Dev TS Vite SW',
        short_name: 'DevTSViteSW',
        description: 'React TS Vite PWA Application',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
