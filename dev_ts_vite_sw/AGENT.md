專案描述
本專案為一個基於 Vite、React 和 TypeScript 的多入口網頁應用程序。其核心目的是展示一個具備 PWA (Progressive Web App) 功能的前端架構，並透過 Service Worker 提供基礎的離線支持與資源管理。

項目實現
1. 技術堆棧
- 前端框架：React 19
- 構建工具：Vite 8
- 程式語言：TypeScript 6
- 路由管理：React Router Dom 7
- PWA 整合：Vite-plugin-pwa (使用 Workbox 7)

2. 多入口配置 (Multi-Page Application)
專案配置了三個主要的 HTML 入口，分別對應不同的應用場景：
- index.html (Main Entry)
- admin.html (Admin Dashboard)
- client.html (Client Interface)
這些入口在 vite.config.ts 中透過 rollupOptions.input 進行配置，確保構建時能生成對應的獨立頁面。

3. 統一渲染邏輯 (renderEntry)
專案採用 src/renderEntry.tsx 作為通用的渲染函數，接收 title 參數並封裝了以下操作：
- 初始化 Service Worker。
- 使用 React 19 的 createRoot 進行掛載。
- 提供路由 Context (BrowserRouter) 並傳遞 title 給 AppRouter。

4. 路由系統 (AppRouter)
所有入口共享同一個 AppRouter.tsx。根據傳入的 title，路由系統會分發到不同的頁面組件（如 App.tsx 或 VitePage.tsx），並支援基礎的路徑導向（如 /admin, /client）。

5. PWA 與 Service Worker 實現
本專案手動實作 Service Worker 邏輯（`src/sw.js`），提供以下功能：
- **HTML 入口緩存**：針對 `Doc` 分類資源，使用 Network First 策略，存於 `html-cache-v1`。
- **靜態資源緩存 (JS/CSS)**：針對腳本與樣式資源，使用 Network First 策略，統一存於 `asset-cache-v1`。
詳細實作內容請參閱 [SW_IMPLEMENTATION.md](./SW_IMPLEMENTATION.md)。

6. agent 運作流程
- 在調整完代碼後不需要進行 dev(運行) 與 build(打包)驗證，都由使用者自行驗證即可
- **本文件變動同步要求**：後續每次對專案功能的改動（尤其是 Service Worker 相關），皆須同步更新 `AGENT.md` 及對應的引用文件。
