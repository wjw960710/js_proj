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

## 2. 緩存策略與順序驗證
**執行邏輯**：
1. **優先從網絡獲取原始請求資源**。
2. **標頭驗證 (X-Tag)**：獲取成功後，檢查響應標頭是否包含 `X-Tag: test`。
   - 若驗證通過，將其存入 `html-cache-v1` 或 `asset-cache-v1` 並返回響應。
3. **入口文件 (Doc) 特殊回退邏輯**：
   - 若原始請求未獲得 `X-Tag: test`，則 Service Worker 會按順序嘗試發起下列路徑的請求：
     1. `/`
     2. `/client`
     3. `/admin`
   - **順序取值**：在每個步驟中，若該路徑的響應包含 `X-Tag: test`，則立即停止嘗試，並將此響應存入原始請求對應的 `html-cache-v1` 緩存中。
   - **最終回退**：若所有預設路徑均未通過 `X-Tag` 驗證，則返回最後一次嘗試的路徑響應內容（例如 `/admin` 的響應）。
4. **網絡失敗處理**：若網絡請求因斷網等原因失敗，則嘗試從緩存中讀取資源返回。
