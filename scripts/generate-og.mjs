/**
 * Capture the live LP WhatsApp device and composite public/share.jpg (1200×630).
 * Usage: npm run og:generate
 */
import { chromium } from 'playwright'
import { spawn } from 'node:child_process'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const outPath = path.join(root, 'public', 'share.jpg')
const legacyOgPath = path.join(root, 'public', 'og.jpg')
const phonePng = path.join(root, 'public', '.og-phone.png')
const frameHtml = path.join(root, 'public', '.og-frame.html')
const framePng = path.join(root, 'public', '.og-frame.png')
const PORT = 4179
const BASE = `http://127.0.0.1:${PORT}`

function waitForServer(url, tries = 40) {
  return new Promise((resolve, reject) => {
    const tick = (n) => {
      const req = http.get(url, (res) => {
        res.resume()
        resolve()
      })
      req.on('error', () => {
        if (n <= 0) reject(new Error(`Server not ready: ${url}`))
        else setTimeout(() => tick(n - 1), 250)
      })
    }
    tick(tries)
  })
}

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, {
    cwd: root,
    encoding: 'utf8',
    stdio: 'inherit',
    ...opts,
  })
  if (r.status !== 0) process.exit(r.status ?? 1)
}

run('npm', ['run', 'build'])

const preview = spawn(
  'npx',
  ['vite', 'preview', '--host', '127.0.0.1', '--port', String(PORT)],
  { cwd: root, stdio: 'pipe' },
)

try {
  await waitForServer(BASE)

  const browser = await chromium.launch()
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: 'dark',
    reducedMotion: 'reduce',
  })

  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await page.waitForSelector('.device .bubble__text')
  await page.addStyleTag({
    content: `
      .device--live { animation: none !important; filter: none !important; }
      .device { --device-w: 300px !important; margin: 0 !important; }
      .bubble, .phone--wa, .hero__media img { animation: none !important; transition: none !important; }
    `,
  })
  // Ensure first demo thread is fully visible (reduced-motion path).
  await page.waitForFunction(
    () => document.querySelectorAll('.device .bubble__text').length >= 4,
  )
  await page.locator('.device').screenshot({ path: phonePng, type: 'png' })
  await browser.close()
} finally {
  preview.kill('SIGTERM')
}

const phoneData = fs.readFileSync(phonePng).toString('base64')
fs.writeFileSync(
  frameHtml,
  `<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Figtree:wght@500;600&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { width: 1200px; height: 630px; overflow: hidden; background: #142033; }
    .frame { position: relative; width: 1200px; height: 630px; overflow: hidden; }
    .bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 58% 42%; filter: saturate(0.86) contrast(0.9) brightness(0.96); }
    .veil {
      position: absolute; inset: 0;
      background:
        linear-gradient(105deg, oklch(12% 0.03 250 / 0.92) 0%, oklch(12% 0.03 250 / 0.78) 38%, oklch(12% 0.03 250 / 0.42) 68%, oklch(12% 0.03 250 / 0.28) 100%),
        linear-gradient(180deg, oklch(12% 0.03 250 / 0.22) 0%, transparent 40%, oklch(12% 0.03 250 / 0.4) 100%);
    }
    .brand {
      position: absolute; left: 64px; top: 50%; transform: translateY(-50%);
      display: flex; flex-direction: column; gap: 16px; color: oklch(96% 0.012 85); max-width: 520px;
    }
    .rule { width: 42px; height: 3px; border-radius: 999px; background: oklch(74% 0.12 48); }
    .name {
      font-family: "Fraunces", Georgia, serif; font-weight: 600; font-size: 78px;
      line-height: 0.95; letter-spacing: -0.04em;
      font-variation-settings: "SOFT" 50, "WONK" 0.35;
    }
    .line {
      font-family: "Figtree", system-ui, sans-serif; font-weight: 600;
      font-size: 28px; line-height: 1.2; letter-spacing: -0.02em; max-width: 14ch;
    }
    .sub {
      font-family: "Figtree", system-ui, sans-serif; font-weight: 500;
      font-size: 18px; color: oklch(84% 0.018 80);
    }
    .phone {
      position: absolute; right: 56px; top: 50%; transform: translateY(-50%);
      width: 292px; height: auto;
      filter: drop-shadow(0 18px 36px rgba(0,0,0,0.38));
    }
  </style>
</head>
<body>
  <div class="frame">
    <img class="bg" src="./photos/dusk.jpg" alt="" />
    <div class="veil" aria-hidden="true"></div>
    <div class="brand">
      <span class="rule" aria-hidden="true"></span>
      <div class="name">Llisar</div>
      <div class="line">Agentes de IA en WhatsApp</div>
      <div class="sub">Inmobiliarias · Turismo</div>
    </div>
    <img class="phone" src="data:image/png;base64,${phoneData}" alt="" />
  </div>
</body>
</html>`,
)

const browser2 = await chromium.launch()
const page2 = await browser2.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 2,
})
await page2.goto(`file://${frameHtml}`, { waitUntil: 'networkidle' })
await page2.evaluate(async () => {
  await document.fonts.ready
})
await page2.screenshot({
  path: framePng,
  type: 'png',
  clip: { x: 0, y: 0, width: 1200, height: 630 },
})
await browser2.close()

const magick = spawnSync(
  'magick',
  [framePng, '-resize', '1200x630!', '-quality', '92', '-strip', outPath],
  { encoding: 'utf8' },
)

for (const f of [phonePng, frameHtml, framePng]) {
  try {
    fs.unlinkSync(f)
  } catch {
    /* ignore */
  }
}

if (magick.status !== 0) {
  console.error(magick.stderr || magick.stdout)
  process.exit(magick.status ?? 1)
}

fs.copyFileSync(outPath, legacyOgPath)
console.log(`Wrote ${outPath}`)
