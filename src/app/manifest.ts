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
        src: '/coin.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}
