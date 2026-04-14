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

  if (isDocRequest) {
    console.log('Detected navigation to entry file (Doc):', request.url);

    // 使用 Network First 策略並緩存到 Cache Storage
    event.respondWith(
      fetch(request)
        .then((response) => {
          // 如果網絡請求成功，將響應放入緩存
          if (response.ok) {
            const copy = response.clone();
            event.waitUntil(
              caches.open('html-cache-v1').then((cache) => cache.put(request, copy))
            );
          }
          return response;
        })
        .catch(() => {
          // 網絡請求失敗（如離線），從緩存中獲取
          return caches.match(request);
        })
    );
  }
});
