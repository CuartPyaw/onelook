import { mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = resolve(root, 'public/pwa')

const maskableSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#3B82F6" />
      <stop offset="100%" stop-color="#8B5CF6" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#bg)" />
  <path d="M208 256 C 280 256, 300 160, 360 128" stroke="#FFFFFF" stroke-width="24" stroke-linecap="round" fill="none" />
  <path d="M208 256 C 300 256, 300 256, 360 256" stroke="#FFFFFF" stroke-width="24" stroke-linecap="round" fill="none" />
  <path d="M208 256 C 280 256, 300 352, 360 384" stroke="#FFFFFF" stroke-width="24" stroke-linecap="round" fill="none" />
  <circle cx="160" cy="256" r="48" fill="#FFFFFF" />
  <circle cx="360" cy="128" r="24" fill="#FFFFFF" />
  <circle cx="360" cy="256" r="24" fill="#FFFFFF" />
  <circle cx="360" cy="384" r="24" fill="#FFFFFF" />
</svg>
`

await mkdir(outDir, { recursive: true })
await sharp(resolve(root, 'public/logo.svg')).resize(192, 192).png().toFile(resolve(outDir, 'icon-192.png'))
await sharp(resolve(root, 'public/logo.svg')).resize(512, 512).png().toFile(resolve(outDir, 'icon-512.png'))
await sharp(Buffer.from(maskableSvg)).resize(512, 512).png().toFile(resolve(outDir, 'icon-maskable-512.png'))

console.log('Generated PWA icons in public/pwa/')
