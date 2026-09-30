// Loads a page in Chrome and prints any pageerror / console errors, plus a geometry
// report for every image (natural size vs rendered box) — used to catch stretched art.
// Usage: node check-page.cjs <file.html>
const path = require('path')
const { chromium } = require('playwright-core')

const FILE = path.resolve(process.argv[2] || 'index.html')
;(async () => {
  const b = await chromium.launch({ channel: 'chrome' })
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } })
  p.on('pageerror', e => console.log('PAGEERROR:', e.message))
  p.on('console', m => { if (m.type() === 'error') console.log('CONSOLE ERROR:', m.text()) })
  await p.goto('file://' + FILE + '?render', { waitUntil: 'load', timeout: 60000 })
  await new Promise(r => setTimeout(r, 2500))
  const state = await p.evaluate(() => ({
    hasGsap: typeof window.gsap,
    hasSeek: typeof window.seek,
    hasDuration: typeof window.DURATION,
    imgs: document.images.length,
    broken: [...document.images].filter(i => i.complete && i.naturalWidth === 0).length,
    geometry: [...document.images].map(i => {
      const r = i.getBoundingClientRect()
      const boxAR = (r.width / r.height).toFixed(3)
      const natAR = (i.naturalWidth / i.naturalHeight).toFixed(3)
      // object-fit:cover crops (fine); only "fill"/none actually distorts the art.
      const fit = getComputedStyle(i).objectFit || 'fill'
      const cropping = fit === 'cover' || fit === 'contain'
      return {
        id: i.id || i.closest('[id]')?.id || i.className || '?',
        natural: `${i.naturalWidth}x${i.naturalHeight}`,
        box: `${Math.round(r.width)}x${Math.round(r.height)}`,
        fit, boxAR, natAR, cropping,
        stretched: r.height > 0 && !cropping && Math.abs(boxAR - natAR) > 0.02,
      }
    }),
  }))
  console.log('STATE:', JSON.stringify({ ...state, geometry: undefined }, null, 1))
  console.log('IMAGES:')
  for (const g of state.geometry) {
    const note = g.stretched ? '*** STRETCHED ***' : g.cropping ? `(cover, crops ${g.boxAR} vs ${g.natAR})` : ''
    console.log(`  ${g.id.padEnd(10)} nat=${g.natural.padEnd(11)} box=${g.box.padEnd(11)} fit=${g.fit.padEnd(7)} ${note}`)
  }
  const stretched = state.geometry.filter(g => g.stretched)
  console.log(stretched.length ? `STRETCHED COUNT: ${stretched.length}` : 'STRETCHED COUNT: 0')
  await b.close()
})().catch(e => { console.error('FATAL', e.message); process.exit(1) })


