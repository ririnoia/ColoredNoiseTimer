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
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  }
}
