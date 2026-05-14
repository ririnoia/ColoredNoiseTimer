import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ColoredNoiseTimer',
    short_name: 'NoiseTimer',
    description: '色名ノイズを聞きながら集中できるポモドーロタイマー',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#030712',
    theme_color: '#030712',
    icons: [
      // ラスターアイコン: Chromium のインストールプロンプトには 192 と 512 の PNG が必要
      { src: '/icon', sizes: '192x192', type: 'image/png' },
      { src: '/icon', sizes: '512x512', type: 'image/png' },
      // SVG: スケーラブルなフォールバック（modern browser）
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  }
}
