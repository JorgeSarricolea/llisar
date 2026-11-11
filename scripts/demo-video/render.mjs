/**
 * Staged Llisar demo: voice-synced fullscreen stages → 16:9 + 9:16 MP4.
 *
 * Usage: node scripts/demo-video/render.mjs
 * Needs: ffmpeg, ffprobe, uvx, Playwright Chromium
 */
import { chromium } from 'playwright'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, 'out')
const RAW = path.join(OUT, 'raw')
const PUBLIC_VIDEO = path.join(__dirname, '../../public/video')
const STORY = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'story.es.json'), 'utf8'),
)
const STAGES_HTML = path.join(__dirname, 'stages.html')
const PHOTOS = {
  hook: path.join(__dirname, '../../public/photos/dusk.jpg'),
  whatsapp: path.join(__dirname, '../../public/photos/hotel.jpg'),
  calendar: path.join(__dirname, '../../public/photos/hotel.jpg'),
  excel: path.join(__dirname, '../../public/photos/apartment.jpg'),
  cta: path.join(__dirname, '../../public/photos/dusk.jpg'),
}
const HOLD_TAIL = 0.45

const FORMATS = [
  { id: '16x9', w: 1920, h: 1080 },
  { id: '9x16', w: 1080, h: 1920 },
]

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { stdio: 'inherit', ...opts })
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(' ')} failed`)
}

function ffprobeDuration(file) {
  const r = spawnSync(
    'ffprobe',
    [
      '-v',
      'error',
      '-show_entries',
      'format=duration',
      '-of',
      'default=nk=1:nw=1',
      file,
    ],
    { encoding: 'utf8' },
  )
  if (r.status !== 0) throw new Error(`ffprobe failed for ${file}`)
  return Number.parseFloat(String(r.stdout).trim())
}

function ttsStage(text, dest) {
  run('uvx', [
    '--from',
    'edge-tts',
    'edge-tts',
    '--voice',
    STORY.voice,
    '--rate',
    STORY.rate,
    '--text',
    text,
    '--write-media',
    dest,
  ])
}

async function buildVoiceTimeline() {
  fs.mkdirSync(RAW, { recursive: true })
  const parts = []
  let t = 0
  const timeline = []

  for (const stage of STORY.stages) {
    const text = stage.lines.join(' ').trim()
    const clip = path.join(RAW, `voice-${stage.id}.mp3`)
    console.log(`TTS ${stage.id}…`)
    ttsStage(text, clip)
    const dur = ffprobeDuration(clip)
    timeline.push({
      id: stage.id,
      label: stage.label,
      start: t,
      end: t + dur,
      duration: dur,
    })
    parts.push(clip)
    t += dur
  }

  const list = path.join(RAW, 'voice-parts.txt')
  fs.writeFileSync(
    list,
    parts.map((p) => `file '${p.replaceAll("'", "'\\''")}'`).join('\n'),
  )
  const voice = path.join(RAW, 'voice.mp3')
  run('ffmpeg', [
    '-y',
    '-f',
    'concat',
    '-safe',
    '0',
    '-i',
    list,
    '-c',
    'copy',
    voice,
  ])

  fs.writeFileSync(
    path.join(RAW, 'timeline.json'),
    JSON.stringify({ total: t, stages: timeline }, null, 2),
  )
  console.log(`voice ${t.toFixed(2)}s · ${timeline.length} stages`)
  return { voice, timeline, total: t }
}

async function captureFormat(fmt, timeline, total) {
  const videoDir = path.join(RAW, `rec-${fmt.id}`)
  fs.mkdirSync(videoDir, { recursive: true })

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: fmt.w, height: fmt.h },
    deviceScaleFactor: 1,
    recordVideo: {
      dir: videoDir,
      size: { width: fmt.w, height: fmt.h },
    },
    colorScheme: 'dark',
  })
  const page = await context.newPage()
  const url = new URL(pathToFileURL(STAGES_HTML).href)
  url.searchParams.set('format', fmt.id)
  url.searchParams.set('photoHook', pathToFileURL(PHOTOS.hook).href)
  url.searchParams.set('photoWa', pathToFileURL(PHOTOS.whatsapp).href)
  url.searchParams.set('photoCal', pathToFileURL(PHOTOS.calendar).href)
  url.searchParams.set('photoExcel', pathToFileURL(PHOTOS.excel).href)
  url.searchParams.set('photoCta', pathToFileURL(PHOTOS.cta).href)

  const recStarted = Date.now()
  await page.goto(url.href, { waitUntil: 'networkidle', timeout: 60_000 })
  await page.waitForFunction(() => window.__demo?.ready)
  await page.waitForTimeout(350)

  const first = timeline[0]
  await page.evaluate(
    ({ id, dur }) => window.__demo.show(id, dur),
    { id: first.id, dur: first.duration },
  )
  const leadSec = (Date.now() - recStarted) / 1000

  const started = Date.now()
  for (const stage of timeline) {
    const targetMs = Math.max(0, stage.start * 1000)
    const wait = targetMs - (Date.now() - started)
    if (wait > 0) await page.waitForTimeout(wait)
    await page.evaluate(
      ({ id, dur }) => window.__demo.show(id, dur),
      { id: stage.id, dur: stage.duration },
    )
  }

  const endWait = total * 1000 + HOLD_TAIL * 1000 - (Date.now() - started)
  if (endWait > 0) await page.waitForTimeout(endWait)

  await context.close()
  await browser.close()

  const files = fs.readdirSync(videoDir).filter((f) => f.endsWith('.webm'))
  if (!files.length) throw new Error(`No webm for ${fmt.id}`)
  const dest = path.join(RAW, `capture-${fmt.id}.webm`)
  fs.renameSync(path.join(videoDir, files[0]), dest)
  for (const f of fs.readdirSync(videoDir)) fs.unlinkSync(path.join(videoDir, f))
  fs.rmdirSync(videoDir)
  console.log(`OK capture ${fmt.id} → ${dest} (lead ${leadSec.toFixed(2)}s)`)
  return { dest, leadSec }
}

function muxFormat(fmt, voice, total, leadSec) {
  const capture = path.join(RAW, `capture-${fmt.id}.webm`)
  const body = path.join(RAW, `body-${fmt.id}.mp4`)
  const finalMp4 = path.join(OUT, `llisar-demo-${fmt.id}.mp4`)
  const need = total + HOLD_TAIL

  run('ffmpeg', [
    '-y',
    '-ss',
    String(Math.max(0, leadSec)),
    '-i',
    capture,
    '-an',
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    '-vf',
    `scale=${fmt.w}:${fmt.h}:force_original_aspect_ratio=decrease,pad=${fmt.w}:${fmt.h}:(ow-iw)/2:(oh-ih)/2,fps=30`,
    '-t',
    String(need),
    body,
  ])

  // If capture is short, pad last frame
  const bodyDur = ffprobeDuration(body)
  let video = body
  if (bodyDur + 0.05 < need) {
    const padded = path.join(RAW, `video-pad-${fmt.id}.mp4`)
    run('ffmpeg', [
      '-y',
      '-i',
      body,
      '-vf',
      `tpad=stop_mode=clone:stop_duration=${(need - bodyDur).toFixed(3)}`,
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      padded,
    ])
    video = padded
  }

  run('ffmpeg', [
    '-y',
    '-i',
    video,
    '-i',
    voice,
    '-c:v',
    'copy',
    '-c:a',
    'aac',
    '-b:a',
    '192k',
    '-shortest',
    '-movflags',
    '+faststart',
    finalMp4,
  ])
  fs.mkdirSync(PUBLIC_VIDEO, { recursive: true })
  const published = path.join(PUBLIC_VIDEO, `llisar-demo-${fmt.id}.mp4`)
  fs.copyFileSync(finalMp4, published)
  console.log(`DONE → ${finalMp4} (${ffprobeDuration(finalMp4).toFixed(1)}s)`)
  console.log(`PUB  → ${published}`)
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true })
  fs.mkdirSync(RAW, { recursive: true })

  const { voice, timeline, total } = await buildVoiceTimeline()

  for (const fmt of FORMATS) {
    const { leadSec } = await captureFormat(fmt, timeline, total)
    muxFormat(fmt, voice, total, leadSec)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
