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
  'https://llisar.com/inmobiliarias',
  'https://llisar.com/turismo',
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

const body = JSON.stringify({
  host,
  key,
  keyLocation,
  urlList: urls,
})

const endpoints = [
  'https://www.bing.com/indexnow',
  'https://api.indexnow.org/indexnow',
]

let lastStatus = 0
let lastText = ''
let ok = false
for (const endpoint of endpoints) {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body,
    })
    lastStatus = res.status
    lastText = await res.text()
    console.log('IndexNow', endpoint, lastStatus, lastText)
    if ([200, 202].includes(res.status)) {
      ok = true
      break
    }
  } catch (err) {
    console.warn('IndexNow', endpoint, 'failed:', err.cause?.code || err.message)
  }
}

if (!ok) {
  console.error('IndexNow submit failed', lastStatus, lastText)
  process.exit(1)
}
console.log('Submitted', urls.length, 'URLs via IndexNow')
