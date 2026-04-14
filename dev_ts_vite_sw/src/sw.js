// Simple Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  // 判斷是否為入口文件 (HTML Document)
  // 這通常對應到 Chrome DevTool Network 的 "Doc" 分類
  const isDocRequest = request.mode === 'navigate' ||
                       (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'));

  // 判斷是否為 JS 檔案 (Script)
  // 這對應到 Chrome DevTool Network 的 "JS" 分類
  const isScriptRequest = request.url.match(/\.(js|jsx)$/) ||
                          request.headers.get('accept')?.includes('application/javascript');

  // 判斷是否為 CSS 檔案 (Stylesheet)
  // 這對應到 Chrome DevTool Network 的 "CSS" 分類
  const isStyleRequest = request.url.match(/\.css$/) ||
                         request.headers.get('accept')?.includes('text/css');

  if (isDocRequest) {
    console.log('Detected navigation to entry file (Doc):', request.url);

    // 順序嘗試路徑：/ > /client > /admin
    const fallbackPaths = ['/', '/client', '/admin'];

    const tryFetchAndCache = async () => {
      // 1. 先嘗試原始請求
      try {
        const response = await fetch(request);
        const xTag = response.headers.get('X-Tag');
        if (response.ok && xTag === 'test') {
          const copy = response.clone();
          await caches.open('html-cache-v1').then((cache) => cache.put(request, copy));
          return response;
        }
      } catch (e) {
        // 網絡錯誤時嘗試從緩存中獲取
        const cachedResponse = await caches.match(request);
        if (cachedResponse) return cachedResponse;
      }

      // 2. 原始請求失敗或 X-Tag 不匹配，按順序嘗試預設路徑
      let lastResponse = null;
      for (const path of fallbackPaths) {
        try {
          const response = await fetch(path);
          lastResponse = response;
          const xTag = response.headers.get('X-Tag');
          console.log(`[SW] Trying fallback path: ${path}, X-Tag: ${xTag}`);

          if (response.ok && xTag === 'test') {
            const copy = response.clone();
            // 注意：將 fallback 路徑的響應緩存在原始請求的 URL 下
            await caches.open('html-cache-v1').then((cache) => cache.put(request, copy));
            return response;
          }
        } catch (e) {
          console.error(`[SW] Error fetching fallback path ${path}:`, e);
        }
      }

      // 3. 若所有路徑皆無 X-Tag: test，則響應最後嘗試的內容（若最後嘗試失敗且無 response，則重新 fetch 原始請求作為保險）
      return lastResponse || fetch(request);
    };

    event.respondWith(tryFetchAndCache());
  } else if (isScriptRequest || isStyleRequest) {
    console.log(`Detected resource (${isScriptRequest ? 'JS' : 'CSS'}):`, request.url);

    // 使用 Network First 策略並緩存到 asset-cache-v1 (需驗證 X-Tag: test)
    event.respondWith(
      fetch(request)
        .then((response) => {
          const xTag = response.headers.get('X-Tag');
          console.log(`[SW] Asset Request: ${request.url}, X-Tag: ${xTag}`);
          if (response.ok && xTag === 'test') {
            const copy = response.clone();
            event.waitUntil(
              caches.open('asset-cache-v1').then((cache) => cache.put(request, copy))
            );
          } else if (xTag !== 'test') {
            console.warn(`Cache skipped: X-Tag verification failed for ${request.url}`);
          }
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
  }
});
