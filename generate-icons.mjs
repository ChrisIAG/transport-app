/**
 * Genera los iconos PNG necesarios para la PWA a partir del SVG existente.
 * Uso: node generate-icons.mjs
 * Requiere: npm install --save-dev sharp  (solo para generación, no va al bundle)
 */
import sharp from 'sharp'
import { mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SVG = join(__dirname, 'public', 'bus-icon.svg')
const OUT  = join(__dirname, 'public', 'icons')

if (!existsSync(OUT)) await mkdir(OUT, { recursive: true })

const sizes = [
  { name: 'icon-152.png', size: 152 },
  { name: 'icon-180.png', size: 180 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'icon-512-maskable.png', size: 512 }, // mismo PNG; el scoped padding lo hace el navegador
]

for (const { name, size } of sizes) {
  await sharp(SVG)
    .resize(size, size)
    .png()
    .toFile(join(OUT, name))
  console.log(`✓ public/icons/${name}`)
}

console.log('\n✅ Iconos generados en public/icons/')
