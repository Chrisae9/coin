import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Coin',
    short_name: 'Coin',
    description: 'A coin flip and D20 roll app.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
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
