# Llisar demo video (16:9 + 9:16)

Same story, **separate framing** per ratio (not a crop of one master):

1. Live site capture — hero LivingChat, then `#que-hace`
2. Edge TTS (es-MX) from `voice-script.es.txt`
3. CTA end card — Hablar con Llisar · +52 999 187 2848

## Run

```bash
cd ~/Documents/projects/llisar
node scripts/demo-video/record.mjs
node scripts/demo-video/assemble.mjs
```

Outputs:

- `scripts/demo-video/out/llisar-demo-16x9.mp4`
- `scripts/demo-video/out/llisar-demo-9x16.mp4`

Optional local URL:

```bash
node scripts/demo-video/record.mjs --url http://127.0.0.1:5173
```

Needs: `ffmpeg`, `ffprobe`, `uvx`, Playwright Chromium (`npx playwright install chromium`).
