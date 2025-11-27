import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Buidl Now! - Developer Tools for Builders Who Ship Fast',
    short_name: 'Buidl Now!',
    description: 'Free online developer tools for Web3 builders. Convert, encode, decode, hash, format, and validate data.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/favicon.png',
        sizes: 'any',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    categories: ['developer', 'tools', 'utilities'],
    lang: 'en-US',
    dir: 'ltr',
  }
}
