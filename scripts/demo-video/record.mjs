/**
 * Capture the live Llisar demo (hero chat + #que-hace) for 16:9 and 9:16.
 * Proper framing per ratio — not a center-crop of one master.
 *
 * Usage: node scripts/demo-video/record.mjs [--url https://llisar.com] [--out scripts/demo-video/out]
 */
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const args = process.argv.slice(2)
const urlFlag = args.indexOf('--url')
const outFlag = args.indexOf('--out')
const BASE_URL = urlFlag >= 0 ? args[urlFlag + 1] : 'https://llisar.com'
const OUT = outFlag >= 0 ? args[outFlag + 1] : path.join(__dirname, 'out')

const FORMATS = [
  {
    id: '16x9',
    width: 1920,
    height: 1080,
    // Desktop hero: phone + copy readable
    deviceScaleFactor: 1,
  },
  {
    id: '9x16',
    width: 1080,
    height: 1920,
    deviceScaleFactor: 1,
  },
]

const HERO_MS = 28_000
const OPS_MS = 10_000
const SETTLE_MS = 1_200

async function captureFormat(fmt) {
  const dir = path.join(OUT, 'raw')
  fs.mkdirSync(dir, { recursive: true })
  const videoDir = path.join(dir, fmt.id)
  fs.mkdirSync(videoDir, { recursive: true })

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: fmt.width, height: fmt.height },
    deviceScaleFactor: fmt.deviceScaleFactor,
    recordVideo: {
      dir: videoDir,
      size: { width: fmt.width, height: fmt.height },
    },
    colorScheme: 'dark',
  })
  const page = await context.newPage()

  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 90_000 })
  await page.waitForSelector('.phone--wa', { timeout: 30_000 })
  await page.waitForTimeout(SETTLE_MS)

  if (fmt.id === '9x16') {
    // Vertical: hide nav noise, zoom the phone stage
    await page.addStyleTag({
      content: `
        .site-nav, .skip, .hero-actions, .hero__copy .lead { display: none !important; }
        .hero { min-height: 100vh !important; padding-top: 48px !important; }
        .hero__grid {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .hero__copy { text-align: center !important; max-width: 92% !important; }
        .hero__copy h1 { font-size: 2.4rem !important; }
        .hero__stage { transform: scale(1.12); transform-origin: top center; }
        .device { margin-inline: auto; }
      `,
    })
  }

  // Hold on living chat
  await page.locator('#hilo').scrollIntoViewIfNeeded()
  await page.waitForTimeout(HERO_MS)

  // Then ops flow until Excel settles
  await page.locator('#que-hace').scrollIntoViewIfNeeded()
  if (fmt.id === '9x16') {
    await page.addStyleTag({
      content: `
        .flow__caps, .flow__cta { display: none !important; }
        .flow__intro h2 { font-size: 1.85rem !important; }
        .flow__track { transform: scale(0.92); transform-origin: top center; }
      `,
    })
  }
  await page.waitForTimeout(OPS_MS)

  await context.close()
  await browser.close()

  const files = fs.readdirSync(videoDir).filter((f) => f.endsWith('.webm'))
  if (!files.length) throw new Error(`No webm for ${fmt.id}`)
  const src = path.join(videoDir, files[0])
  const dest = path.join(dir, `capture-${fmt.id}.webm`)
  fs.renameSync(src, dest)
  // cleanup empty dir leftovers
  for (const f of fs.readdirSync(videoDir)) {
    fs.unlinkSync(path.join(videoDir, f))
  }
  fs.rmdirSync(videoDir)
  console.log(`OK ${fmt.id} → ${dest}`)
  return dest
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true })
  for (const fmt of FORMATS) {
    await captureFormat(fmt)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
