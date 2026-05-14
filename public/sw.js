const CACHE_NAME = 'cnt-v1'

// インストール: ルートページとオフラインフォールバックページをプリキャッシュ
// JS/CSS バンドルはコンテンツハッシュ付きのため事前列挙が困難なので、
// JS/CSS に依存しない自己完結の offline.html をオフライン時に提供する
self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(['/', '/offline.html']))
  )
})

// アクティベート: 古いキャッシュを削除
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  // ナビゲーション: ネットワーク優先 → オフライン時は offline.html をフォールバック
  // オフライン時は常に offline.html を返すため、ナビゲーション応答はキャッシュしない
  // （書き込んでも読まれず Cache Storage を無駄に消費するため）
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          return await fetch(request)
        } catch {
          // JS/CSS に依存しない offline.html を提供し、壊れたアプリシェルを避ける
          const cached = await caches.match('/offline.html')
          return cached ?? Response.error()
        }
      })()
    )
    return
  }

  // Next.js 静的アセット (_next/static): キャッシュ優先（コンテンツハッシュで一意）
  if (url.pathname.startsWith('/_next/static')) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(request)
        if (cached) return cached

        const response = await fetch(request)
        // Fix2: 失敗レスポンスはキャッシュしない
        if (response.ok) {
          // Fix3: event.waitUntil でキャッシュ書き込み完了まで SW を生かし続ける
          event.waitUntil(
            caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()))
          )
        }
        return response
      })()
    )
  }
})
