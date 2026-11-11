#!/usr/bin/env node
/**
 * Notify IndexNow (Bing, Yandex, Seznam, Naver). Google does not consume IndexNow.
 * Key file must be live at https://llisar.com/<key>.txt
 */
import { readFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const keyPath = join(root, '.indexnow-key')
if (!existsSync(keyPath)) {
  console.error('Missing .indexnow-key — generate public/<key>.txt first')
  process.exit(1)
}

const key = readFileSync(keyPath, 'utf8').trim()
const host = 'llisar.com'
const keyLocation = `https://${host}/${key}.txt`

const urls = [
  'https://llisar.com/',
  'https://llisar.com/nosotros',
  'https://llisar.com/contacto',
  'https://llisar.com/blog',
  'https://llisar.com/blog/como-atender-leads-inmobiliaria-whatsapp',
  'https://llisar.com/blog/agente-ia-whatsapp-turismo-cuando-conviene',
  'https://llisar.com/blog/calificar-leads-inmobiliarios-whatsapp',
  'https://llisar.com/blog/agendar-visitas-desde-whatsapp',
  'https://llisar.com/blog/errores-atencion-whatsapp-inmobiliaria-turismo',
  'https://llisar.com/sitemap.xml',
]

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host,
    key,
    keyLocation,
    urlList: urls,
  }),
})

console.log('IndexNow status', res.status, await res.text())
if (![200, 202].includes(res.status)) process.exit(1)
console.log('Submitted', urls.length, 'URLs via IndexNow')
