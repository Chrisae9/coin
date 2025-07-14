import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Coin',
    short_name: 'Coin',
    description: 'A coin flip and D20 roll app.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/coin.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/coin.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/coin.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
