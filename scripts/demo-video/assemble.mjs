/**
 * Voice (Edge TTS) + CTA stills + mux into final 16:9 and 9:16 MP4s.
 *
 * Prerequisites: ffmpeg, uvx, capture webms in out/raw/
 * Usage: node scripts/demo-video/assemble.mjs
 */
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, 'out')
const RAW = path.join(OUT, 'raw')
const SCRIPT = path.join(__dirname, 'voice-script.es.txt')
const CTA_HTML = path.join(__dirname, 'cta.html')

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { stdio: 'inherit', ...opts })
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(' ')} failed`)
}

function ffprobeDuration(file) {
  const r = spawnSync(
    'ffprobe',
    ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nk=1:nw=1', file],
    { encoding: 'utf8' },
  )
  if (r.status !== 0) throw new Error(`ffprobe failed for ${file}`)
  return Number.parseFloat(String(r.stdout).trim())
}

async function renderCtaPng(width, height, dest) {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1,
  })
  await page.goto(`file://${CTA_HTML}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)
  await page.screenshot({ path: dest, type: 'png' })
  await browser.close()
}

async function main() {
  fs.mkdirSync(RAW, { recursive: true })
  fs.mkdirSync(OUT, { recursive: true })

  const voice = path.join(RAW, 'voice.mp3')
  const text = fs.readFileSync(SCRIPT, 'utf8').trim()
  console.log('TTS…')
  run('uvx', [
    '--from',
    'edge-tts',
    'edge-tts',
    '--voice',
    'es-MX-DaliaNeural',
    '--rate',
    '+2%',
    '--text',
    text,
    '--write-media',
    voice,
  ])

  const voiceDur = ffprobeDuration(voice)
  const ctaSec = 4.5
  console.log(`voice ${voiceDur.toFixed(2)}s`)

  const jobs = [
    { id: '16x9', w: 1920, h: 1080 },
    { id: '9x16', w: 1080, h: 1920 },
  ]

  for (const job of jobs) {
    const capture = path.join(RAW, `capture-${job.id}.webm`)
    if (!fs.existsSync(capture)) throw new Error(`Missing ${capture} — run record.mjs first`)

    const ctaPng = path.join(RAW, `cta-${job.id}.png`)
    const ctaMp4 = path.join(RAW, `cta-${job.id}.mp4`)
    const silent = path.join(RAW, `silent-${job.id}.mp4`)
    const body = path.join(RAW, `body-${job.id}.mp4`)
    const finalMp4 = path.join(OUT, `llisar-demo-${job.id}.mp4`)

    console.log(`CTA still ${job.id}…`)
    await renderCtaPng(job.w, job.h, ctaPng)
    run('ffmpeg', [
      '-y',
      '-loop',
      '1',
      '-i',
      ctaPng,
      '-c:v',
      'libx264',
      '-t',
      String(ctaSec),
      '-pix_fmt',
      'yuv420p',
      '-vf',
      `scale=${job.w}:${job.h}:force_original_aspect_ratio=decrease,pad=${job.w}:${job.h}:(ow-iw)/2:(oh-ih)/2`,
      ctaMp4,
    ])

    // Normalize capture to H264 + exact canvas
    run('ffmpeg', [
      '-y',
      '-i',
      capture,
      '-an',
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      '-vf',
      `scale=${job.w}:${job.h}:force_original_aspect_ratio=decrease,pad=${job.w}:${job.h}:(ow-iw)/2:(oh-ih)/2,fps=30`,
      body,
    ])

    const bodyDur = ffprobeDuration(body)
    const needBody = Math.max(8, voiceDur - ctaSec + 0.4)
    // Trim or pad body so voice finishes near CTA
    const trimmed = path.join(RAW, `body-fit-${job.id}.mp4`)
    if (bodyDur > needBody) {
      run('ffmpeg', [
        '-y',
        '-i',
        body,
        '-t',
        String(needBody),
        '-c',
        'copy',
        trimmed,
      ])
    } else {
      const pad = needBody - bodyDur
      run('ffmpeg', [
        '-y',
        '-i',
        body,
        '-vf',
        `tpad=stop_mode=clone:stop_duration=${pad.toFixed(3)}`,
        '-c:v',
        'libx264',
        '-pix_fmt',
        'yuv420p',
        trimmed,
      ])
    }

    // Re-encode concat (stream copy often drops the second segment duration)
    run('ffmpeg', [
      '-y',
      '-i',
      trimmed,
      '-i',
      ctaMp4,
      '-filter_complex',
      '[0:v][1:v]concat=n=2:v=1:a=0[v]',
      '-map',
      '[v]',
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      silent,
    ])

    const silentDur = ffprobeDuration(silent)
    // Pad silent video if voice is longer (so CTA holds under the last lines)
    const videoForMux = path.join(RAW, `video-pad-${job.id}.mp4`)
    if (silentDur + 0.15 < voiceDur) {
      const pad = voiceDur - silentDur + 0.35
      run('ffmpeg', [
        '-y',
        '-i',
        silent,
        '-vf',
        `tpad=stop_mode=clone:stop_duration=${pad.toFixed(3)}`,
        '-c:v',
        'libx264',
        '-pix_fmt',
        'yuv420p',
        videoForMux,
      ])
    } else {
      fs.copyFileSync(silent, videoForMux)
    }

    console.log(`Mux ${job.id}…`)
    run('ffmpeg', [
      '-y',
      '-i',
      videoForMux,
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
    console.log(`DONE → ${finalMp4} (${ffprobeDuration(finalMp4).toFixed(1)}s)`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
