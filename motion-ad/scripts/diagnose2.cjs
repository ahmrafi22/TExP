// Probe: how to drive the DialKit colour control (Gradient Color Start/End) and how
// the version badge appears, so captures can be graded and version-stripped.
const { chromium } = require('playwright-core')
const sleep = ms => new Promise(r => setTimeout(r, ms))
;(async () => {
  const b = await chromium.launch({ channel: 'chrome' })
  const ctx = await b.newContext({ viewport: { width: 1600, height: 1200 }, deviceScaleFactor: 1, colorScheme: 'dark' })
  await ctx.addInitScript(() => { try { localStorage.setItem('theme', 'dark'); localStorage.setItem('texp-tour-seen-v1', '1') } catch {} })
  const p = await ctx.newPage()
  p.setDefaultTimeout(8000)
  await p.goto('http://localhost:3117', { waitUntil: 'load', timeout: 90000 })
  await p.waitForSelector('input[aria-label="Animation text"]', { timeout: 90000 })
  await sleep(1800)

  console.log('VERSION BADGES:', JSON.stringify(await p.evaluate(() =>
    [...document.querySelectorAll('span,div')].map(e => (e.textContent || '').trim())
      .filter(t => /^v\d+\.\d+/.test(t)).slice(0, 5))))

  await p.getByRole('tab', { name: /Style & Background/ }).click({ timeout: 8000 })
  await sleep(500)
  await p.getByText('Solid Color', { exact: true }).first().click()
  await sleep(300)
  await p.getByText('Gradient Fill', { exact: true }).first().click()
  await sleep(500)

  console.log('COLOR CONTROLS:', JSON.stringify(await p.evaluate(() => {
    const vis = e => !!(e.offsetParent || e.getClientRects().length)
    return [...document.querySelectorAll('.dialkit-root *')]
      .filter(e => vis(e) && /Color Start|Color End/i.test(e.textContent || '') && e.children.length === 0)
      .map(e => e.textContent.trim()).slice(0, 6)
  })))

  // Open the "Color Start" control and dump whatever editor it reveals (inputs / swatches).
  try {
    await p.getByText('Color Start', { exact: false }).first().click({ timeout: 5000 })
    await sleep(600)
    console.log('EDITOR:', JSON.stringify(await p.evaluate(() => {
      const vis = e => !!(e.offsetParent || e.getClientRects().length)
      const inputs = [...document.querySelectorAll('input,textarea')].filter(vis)
        .map(i => ({ tag: i.tagName, type: i.type, val: (i.value || '').slice(0, 24), ph: i.placeholder || '', aria: i.getAttribute('aria-label') || '' }))
      const btns = [...document.querySelectorAll('button')].filter(vis)
        .map(b2 => (b2.textContent || '').trim().slice(0, 20)).filter(Boolean)
      return { inputs, buttons: [...new Set(btns)].slice(0, 24) }
    }), null, 1))
  } catch (e) { console.log('color start open failed:', e.message.split('\n')[0]) }

  await b.close()
  console.log('PROBE3 DONE')
})().catch(e => { console.error('FATAL', e.message); process.exit(1) })
