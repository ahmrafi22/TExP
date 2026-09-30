// Capture real TExP UI screenshots from the running dev server (localhost:3000)
// into ../a/*.jpg — these are the ad's product imagery (no mockups, no stock).
//
// Usage:  node run-with-server.cjs capture.cjs     (boots the dev server, captures, stops it)
//    or:  npm run dev  (separately) +  node capture.cjs
const path = require('path')
const fs = require('fs')
const { chromium } = require('playwright-core')

const OUT = path.resolve(__dirname, '..', 'a')
const URL = process.env.TEXP_URL || 'http://localhost:3117'
const SHOT = { type: 'jpeg', quality: 92 }
const sleep = ms => new Promise(r => setTimeout(r, ms))
const log = (...a) => console.log('[capture]', ...a)

// Grading applied during capture so the art matches the ad's premium gradient:
// the version badge (v0.x.x) is removed, and the preview artboard background is
// forced to the ad's blue→black→red ramp.
const ART_GRADIENT = 'linear-gradient(180deg, #1E40AF 0%, #16265C 26%, #070A12 50%, #2B0A14 74%, #C0151F 100%)'

async function tryStep(name, fn) {
  try { await fn(); log('ok  -', name) } catch (e) { log('skip-', name, '->', String(e.message).split('\n')[0]) }
}

;(async () => {
  fs.mkdirSync(OUT, { recursive: true })
  const browser = await chromium.launch({ channel: 'chrome' })
  // 1920x1200 = 16:10, exactly the ratio the app window is displayed at (960x600).
  const ctx = await browser.newContext({
    viewport: { width: 1920, height: 1200 },
    deviceScaleFactor: 2,
    colorScheme: 'dark',
  })
  // Pin the dark theme and skip the first-run onboarding tour before the app boots.
  await ctx.addInitScript(() => {
    try {
      localStorage.setItem('theme', 'dark')
      localStorage.setItem('texp-tour-seen-v1', '1')
    } catch {}
  })
  const page = await ctx.newPage()
  page.setDefaultTimeout(8000)
  page.on('pageerror', e => log('pageerror:', e.message))

  // driver.js onboarding can pop up mid-session and swallow clicks — force-dismiss it.
  const killTour = async () => {
    const present = await page.evaluate(() => !!document.querySelector('.driver-overlay, .driver-popover'))
    if (!present) return
    await page.evaluate(() => {
      document.querySelectorAll('.driver-overlay, .driver-popover, .driver-active').forEach(el => el.remove())
      try { localStorage.setItem('texp-tour-seen-v1', '1') } catch {}
    })
    log('dismissed onboarding tour')
    await sleep(150)
  }

  /** Remove the "v0.x.x" version badge wherever it renders (header, timeline, etc.). */
  const stripVersion = async () => {
    const n = await page.evaluate(() => {
      let killed = 0
      document.querySelectorAll('span,div,p').forEach(el => {
        if (el.children.length === 0 && /^v\d+\.\d+(\.\d+)?$/.test((el.textContent || '').trim())) {
          el.remove(); killed++
        }
      })
      return killed
    })
    if (n) log(`stripped ${n} version badge(s)`)
  }

  /** Force the preview artboard to the ad's premium ramp (its inline style otherwise wins). */
  const gradeArtboard = async () => {
    const ok = await page.evaluate(grad => {
      const ab = [...document.querySelectorAll('#tour-canvas div')].find(d =>
        d.className.includes('flex-1') && /gradient/.test(d.getAttribute('style') || ''))
      if (!ab) return false
      ab.style.setProperty('background', grad, 'important')
      return true
    }, ART_GRADIENT)
    log(ok ? 'artboard graded to premium ramp' : 'artboard grade: not applied')
  }

  const prep = async () => { await killTour(); await stripVersion() }

  log('loading', URL)
  await page.goto(URL, { waitUntil: 'load', timeout: 90000 })
  await page.waitForSelector('input[aria-label="Animation text"]', { timeout: 90000 })
  await sleep(2400) // hydration + font swaps
  await page.evaluate(() => document.fonts.ready)
  await sleep(300)
  log('dark theme active:', await page.evaluate(() => document.documentElement.classList.contains('dark')))
  await prep()

  // The hero crop window: 700x868 (~600:744), centered on the artboard.
  const crop = async () => {
    const b = await page.locator('#tour-canvas').boundingBox()
    const w = 700, h = 868
    return { x: Math.round(b.x + (b.width - w) / 2), y: Math.round(b.y + (b.height - h) / 2), width: w, height: h }
  }

  // 1. Sample copy
  const input = page.locator('input[aria-label="Animation text"]')
  await input.click()
  await input.fill('Make words move')
  await sleep(400)

  // 2. Plain state (before)
  const c = await crop()
  await page.screenshot({ path: path.join(OUT, 'canvas-before.jpg'), clip: c, ...SHOT })
  log('wrote canvas-before.jpg')

  // 3. Style & Background: bigger type (DialKit value chip -> option) + gradient artboard
  await tryStep('open Style & Background tab', async () => {
    await page.getByRole('tab', { name: /Style & Background/ }).click()
    await sleep(600)
  })
  await tryStep('font size -> 6XL (60px)', async () => {
    await page.getByText('4XL (36px)', { exact: true }).first().click()
    await sleep(350)
    await page.getByText('6XL (60px)', { exact: true }).first().click()
    await sleep(450)
  })
  await tryStep('background -> Gradient Fill', async () => {
    await page.getByText('Solid Color', { exact: true }).first().click()
    await sleep(350)
    await page.getByText('Gradient Fill', { exact: true }).first().click()
    await sleep(550)
  })

  // 4. Preset mid-flight (after)
  await tryStep('open presets tab', async () => {
    await page.locator('button[aria-label="Presets"]').click()
    await sleep(400)
  })
  await tryStep('apply Zoom Rotate + catch mid-flight', async () => {
    await page.locator('button', { hasText: 'Zoom Rotate' }).first().click()
    await sleep(900)
    await gradeArtboard()
    await page.screenshot({ path: path.join(OUT, 'canvas-after.jpg'), clip: c, ...SHOT })
    log('wrote canvas-after.jpg')
    await sleep(1400)
  })

  // 5. Full workspace after the tween settles (beat A hero) — 16:10, shown at 960x600
  await prep()
  await gradeArtboard()
  await page.screenshot({ path: path.join(OUT, 'hero-app.jpg'), ...SHOT })
  log('wrote hero-app.jpg')

  // 6. Split-text showcase (different word, mid-flight)
  await tryStep('split-text showcase', async () => {
    await input.click()
    await input.fill('MOTION')
    await sleep(400)
    await page.locator('button', { hasText: 'Bounce In' }).first().click()
    await sleep(660)
    await gradeArtboard()
    await page.screenshot({ path: path.join(OUT, 'split-canvas.jpg'), clip: c, ...SHOT })
    log('wrote split-canvas.jpg')
    await sleep(1200)
  })

  // 7. Timeline workspace (seeded with two demo items) — playing, so the stage is alive
  await tryStep('timeline workspace', async () => {
    await page.locator('[title="Timeline sequence workspace"]').click()
    await sleep(1400)
    await killTour()
    await page.locator('[title="Play / Pause (Space)"]').click({ timeout: 10000 })
    await sleep(1600)
    await stripVersion()
    // The timeline artboard paints itself via the .canvas-grid theme class (no inline
    // gradient like text mode), so target it by class and override both paint layers.
    const graded = await page.evaluate(grad => {
      const st = document.querySelector('.canvas-grid')
      if (!st) return false
      st.style.setProperty('background', grad, 'important')
      st.style.setProperty('background-image', 'none', 'important')
      return true
    }, ART_GRADIENT)
    log(graded ? 'timeline stage graded' : 'timeline stage grade skipped')
    await page.screenshot({ path: path.join(OUT, 'timeline.jpg'), ...SHOT })
    log('wrote timeline.jpg')
  })

  // 8. Export dialog (React + TS are the store defaults; show the full component)
  await tryStep('export dialog', async () => {
    try {
      await page.locator('[title="Text animation workspace"]').click({ timeout: 20000 })
      await sleep(1200)
    } catch {
      // The timeline's transport can swallow the mode switch — reload resets to text mode.
      log('mode switch blocked — reloading app')
      await page.goto(URL, { waitUntil: 'load', timeout: 90000 })
      await page.waitForSelector('input[aria-label="Animation text"]', { timeout: 90000 })
      await sleep(1500)
    }
    await killTour()
    await input.click()
    await input.fill('Make words move')
    await sleep(500)
    await page.getByRole('button', { name: 'Get Code' }).click({ timeout: 15000 })
    await sleep(800)
    await page.getByRole('tab', { name: 'Complete Component' }).click()
    await sleep(400)
    await page.locator('[role="dialog"]').first().screenshot({ path: path.join(OUT, 'code-dialog.jpg'), ...SHOT })
    log('wrote code-dialog.jpg')
  })

  await browser.close()
  log('done')
})().catch(e => { console.error(e); process.exit(1) })
