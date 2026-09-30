// Packs index.html into a single self-contained file: GSAP + every image inlined
// as data URIs, so the ad is one shareable .html that works offline (font links
// still come from Google Fonts). Output: ../texp-motion-ad-standalone.html
const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8')

// 1) Inline GSAP (guard against a literal </script> inside the bundle)
const gsap = fs.readFileSync(path.join(ROOT, 'gsap.min.js'), 'utf8').replace(/<\/script/gi, '<\\/script')
html = html.replace('<script src="gsap.min.js"></script>', () => `<script>\n${gsap}\n</script>`)

// 2) Inline every asset referenced as 'a/<name>' — replace the path token only so the
//    surrounding JS quotes (or HTML attribute quotes) survive.
const dir = path.join(ROOT, 'a')
const mime = f => (f.endsWith('.svg') ? 'image/svg+xml' : 'image/jpeg')
let inlined = 0
for (const f of fs.readdirSync(dir)) {
  const buf = fs.readFileSync(path.join(dir, f))
  if (buf.length > 4_000_000) continue // safety: skip absurdly large files
  const uri = `data:${mime(f)};base64,` + buf.toString('base64')
  const token = `a/${f}`
  if (html.includes(token)) { html = html.split(token).join(uri); inlined++ }
}

const out = path.join(ROOT, 'texp-motion-ad-standalone.html')
fs.writeFileSync(out, html)
console.log(`wrote texp-motion-ad-standalone.html — ${inlined} refs inlined, ${(html.length / 1024 / 1024).toFixed(2)} MB`)
