// High-fidelity frame-accurate renderer for TExP Launch Film
// Uses Playwright with local Chrome to render PNG stills or full MP4 at 1920x1080 60fps.

const path = require('path')
const fs = require('fs')
const { spawn } = require('child_process')
const { chromium } = require(path.resolve(__dirname, '../../.agents/skills/motion-ad/scripts/node_modules/playwright-core'))

const arg = (name, def) => {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 ? process.argv[i + 1] : def
}

const W = 1920
const H = 1080
const FPS = Number(arg('fps', 60))
const OUT = arg('out', path.resolve(__dirname, '../renders/picture.mp4'))
const STILLS = arg('stills', null)
const PAGE = path.resolve(__dirname, '../index.html')

fs.mkdirSync(path.resolve(__dirname, '../renders'), { recursive: true })
fs.mkdirSync(path.resolve(__dirname, '../renders/stills'), { recursive: true })

;(async () => {
  console.log(`[Renderer] Launching Chrome...`)
  const browser = await chromium.launch({ channel: 'chrome' })
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 })

  console.log(`[Renderer] Navigating to file://${PAGE}?render`)
  await page.goto('file://' + PAGE + '?render')
  await page.evaluate(() => window.ready)
  await page.waitForTimeout(600)

  if (STILLS) {
    const times = STILLS.split(',').map(Number)
    console.log(`[Renderer] Capturing ${times.length} stills...`)
    for (const t of times) {
      await page.evaluate(t => window.seek(t), t)
      const filename = path.resolve(__dirname, `../renders/stills/still-${t.toFixed(2)}s.jpg`)
      await page.screenshot({ path: filename, quality: 90, type: 'jpeg' })
      console.log(`  -> Saved ${filename}`)
    }
    await browser.close()
    console.log(`[Renderer] Stills capture completed.`)
    return
  }

  const duration = await page.evaluate(() => window.DURATION)
  const totalFrames = Math.round(duration * FPS)
  console.log(`[Renderer] Rendering ${totalFrames} frames (${duration}s @ ${FPS}fps) to ${OUT}...`)

  const ff = spawn('ffmpeg', [
    '-y', '-v', 'warning',
    '-f', 'image2pipe',
    '-framerate', String(FPS),
    '-c:v', 'png',
    '-i', '-',
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-crf', '16',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    OUT
  ], { stdio: ['pipe', 'inherit', 'inherit'] })

  ff.on('error', err => {
    console.error('\n[FFmpeg Process Error]:', err)
  })
  ff.stdin.on('error', err => {
    console.error('\n[FFmpeg Stdin Error]:', err)
  })

  for (let f = 0; f < totalFrames; f++) {
    const t = f / FPS
    await page.evaluate(t => window.seek(t), t)
    const buf = await page.screenshot({ type: 'png', timeout: 30000 })
    if (!ff.stdin.write(buf)) {
      await new Promise(resolve => ff.stdin.once('drain', resolve))
    }
    if (f % (FPS * 2) === 0) {
      process.stdout.write(`\r  Progress: ${(t).toFixed(1)}s / ${duration}s (${Math.round((f / totalFrames) * 100)}%)`)
    }
  }

  ff.stdin.end()
  await new Promise(resolve => ff.on('close', resolve))
  await browser.close()
  console.log(`\n[Renderer] Full video render finished: ${OUT}`)
})().catch(err => {
  console.error('\n[Renderer Error]:', err)
  process.exit(1)
})

process.on('uncaughtException', err => {
  console.error('\n[UncaughtException]:', err)
  process.exit(1)
})
process.on('unhandledRejection', reason => {
  console.error('\n[UnhandledRejection]:', reason)
  process.exit(1)
})
