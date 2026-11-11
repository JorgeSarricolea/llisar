# Llisar demo video (16:9 + 9:16)

Voice-synced **desk-zoom walkthrough** (cinematic push-in / pull-out, not LP slides):

1. Hook — dusk push-in on brand
2. WhatsApp — hotel desk + giant phone, hard push into the chat
3. Calendario — laptop agenda, event lands while camera pushes
4. Excel — laptop sheet, new row while camera pushes
5. CTA — dusk pull-out + phone

Story: `story.es.json` · Scenes: `stages.html` · Pipeline: `render.mjs`

## Run

```bash
cd ~/Documents/projects/llisar
npm run demo:video
```

Outputs:

- `scripts/demo-video/out/llisar-demo-16x9.mp4`
- `scripts/demo-video/out/llisar-demo-9x16.mp4`
- Copied to LP: `public/video/llisar-demo-{16x9,9x16}.mp4` (hero “Ver el ejemplo” modal)

Needs: `ffmpeg`, `ffprobe`, `uvx`, Playwright Chromium (`npx playwright install chromium`).

Legacy LP-scroll scripts (`record.mjs` / `assemble.mjs`) remain for reference; `demo:video` uses the staged renderer.
