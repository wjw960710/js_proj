# Service Worker 實現細節

本文件詳細說明專案中 Service Worker 的實現邏輯。

## 1. 核心功能
- **生命週期監聽**：
  - `install`：自動跳過等待狀態 (`skipWaiting`)。
  - `activate`：當前僅做基本日誌紀錄。
- **請求攔截 (Fetch Event)**：
  - **入口文件偵測 (Doc)**：
    - 透過 `request.mode === 'navigate'` 或檢查 `Accept` 標頭是否包含 `text/html` 來判定。
    - 這對應到 Chrome DevTools Network 面板中的 `Doc` 分類。
    - 目前實作為 Network First (網絡優先) 策略，將響應存入 `html-cache-v1`。
  - **JS 資源偵測 (Script)**：
    - 透過副檔名 `.js`, `.jsx` 或 `Accept: application/javascript` 標頭來判定。
    - 這對應到 Chrome DevTools Network 面板中的 `JS` 分類。
    - 採用 Network First 策略，將響應存入 `asset-cache-v1`。
  - **CSS 資源偵測 (Style)**：
    - 透過副檔名 `.css` 或 `Accept: text/css` 標頭來判定。
    - 這對應到 Chrome DevTools Network 面板中的 `CSS` 分類。
    - 採用 Network First 策略，與 JS 資源一同存入 `asset-cache-v1`。

## 2. 緩存策略 (Network First)
**執行邏輯**：
1. 優先從網絡獲取最新資源。
2. **標頭驗證**：獲取成功後，檢查響應標頭是否包含 `X-Tag: test`。
3. **條件式緩存**：
   - 若驗證通過（標頭匹配），將響應副本存入對應的緩存（`html-cache-v1` 或 `asset-cache-v1`）。
   - 若驗證失敗（標頭不匹配或缺失），則跳過緩存存儲。
4. 若網絡請求失敗（如離線），則從緩存中讀取對應資源並返回。
