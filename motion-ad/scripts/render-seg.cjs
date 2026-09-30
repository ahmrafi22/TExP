// Segment renderer: the skill's render.cjs pipes all 450 frames through one long
// ffmpeg process, which cannot finish inside a single foreground command window.
// This writes numbered PNG frames for a time range instead, so the whole ad can be
// rendered in several short runs and encoded in a final ffmpeg pass.
//
//   node scripts/render-seg.cjs --from 0 --to 100     # frames 0..99 -> frames/
//   node scripts/render-seg.cjs --from 100 --to 200
//
// Frames land in frames/<n>.png at exactly 1920x1080, 30 fps, matching render.cjs.
const path = require('path')
const { chromium } = require('playwright-core')

const arg = (name, def) => {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 ? process.argv[i + 1] : def
}
const [W, H] = arg('size', '1920x1080').split('x').map(Number)
const FPS = Number(arg('fps', 30))
const FROM = Number(arg('from', 0))
const TO = Number(arg('to', 0))
const OUT = path.resolve(arg('dir', 'frames'))
const PAGE = path.resolve(arg('page', 'index.html'))

;(async () => {
  const fs = require('fs')
  fs.mkdirSync(OUT, { recursive: true })

  const browser = await chromium.launch({ channel: arg('channel', 'chrome') })
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 })
  await page.goto('file://' + PAGE + '?render')
  await page.evaluate(() => window.ready)
  await page.waitForTimeout(500)

  let n = 0
  for (let f = FROM; f < TO; f++) {
    await page.evaluate(t => window.seek(t), f / FPS)
    await page.screenshot({ path: path.join(OUT, String(f).padStart(4, '0') + '.png'), type: 'png' })
    n++
  }
  await browser.close()
  console.log(`wrote ${n} frames (${FROM}..${TO - 1}) to ${OUT} at ${W}x${H}`)
})()
