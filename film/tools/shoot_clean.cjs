const path = require('path')
const { chromium } = require(path.resolve(__dirname, '../../.agents/skills/motion-ad/scripts/node_modules/playwright-core'))
const fs = require('fs')

;(async () => {
  console.log('[ShootClean] Launching browser...')
  const browser = await chromium.launch({ channel: 'chrome' })
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, colorScheme: 'dark' })
  await ctx.addInitScript(() => {
    try {
      localStorage.setItem('texp-onboarding-done', '1')
      localStorage.setItem('theme', 'dark')
    } catch {}
  })

  const page = await ctx.newPage()
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 120000 })
  await page.waitForTimeout(2000)

  // dismiss onboarding
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press('Escape')
    await page.waitForTimeout(150)
  }

  // 1. Text mode with empty canvas (hide preview text so we can overlay dynamic GSAP text)
  await page.evaluate(() => {
    const el = document.querySelector('#preview-element') || document.querySelector('.preview-canvas')
    // Hide the center preview text element so the canvas dot grid is clean
    const t = document.querySelector('[data-tour="canvas-text"]') || document.querySelector('#preview-text')
    // or set opacity of all text in preview canvas to 0
    const canvas = document.querySelector('#tour-canvas')
    if (canvas) {
      const texts = canvas.querySelectorAll('h1, h2, span, p, div')
      texts.forEach(node => {
        if (node.textContent && node.textContent.includes('Hello GSAP')) {
          node.style.visibility = 'hidden'
        }
      })
    }
    // Also clear the text input value
    const input = document.querySelector('input[placeholder="Enter animation text..."]')
    if (input) {
      input.value = ''
      input.placeholder = ''
    }
  })
  await page.waitForTimeout(300)
  await page.screenshot({ path: path.resolve(__dirname, '../ref/clean-text-mode.png') })
  console.log('[ShootClean] Saved clean-text-mode.png')

  // 2. Click 3D Flip preset to capture real active state
  const flipBtn = page.getByRole('button', { name: /3D Flip/i })
  if (await flipBtn.count()) {
    await flipBtn.click()
    await page.waitForTimeout(500)
    await page.screenshot({ path: path.resolve(__dirname, '../ref/clean-3dflip-active.png') })
    console.log('[ShootClean] Saved clean-3dflip-active.png')
  }

  // 3. Switch to Timeline Mode
  const tlBtn = page.getByRole('button', { name: /Timeline Animation/i })
  if (await tlBtn.count()) {
    await tlBtn.click()
    await page.waitForTimeout(1200)
    await page.screenshot({ path: path.resolve(__dirname, '../ref/clean-timeline-mode.png') })
    console.log('[ShootClean] Saved clean-timeline-mode.png')
  }

  // 4. Open Export Code modal
  const codeBtn = page.getByRole('button', { name: /Get Code/i })
  if (await codeBtn.count()) {
    await codeBtn.click()
    await page.waitForTimeout(800)
    await page.screenshot({ path: path.resolve(__dirname, '../ref/clean-code-modal.png') })
    console.log('[ShootClean] Saved clean-code-modal.png')
  }

  await browser.close()
  console.log('[ShootClean] All clean plates captured successfully!')
})().catch(err => {
  console.error('[ShootClean] Error:', err)
  process.exit(1)
})
