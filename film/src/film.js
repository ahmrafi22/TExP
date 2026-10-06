// TExP Launch Film — Master Animation Script
// Pure deterministic GSAP timeline.
// Exposes window.DURATION, window.seek(t), window.ready for frame-accurate render.

const DURATION = 24.0
window.DURATION = DURATION

const LOGO_D = "M4.625 0C6.89583 0.0833333 9.72917 0.145833 13.125 0.1875C16.5208 0.229167 20.5104 0.25 25.0938 0.25C29.6771 0.25 33.6667 0.229167 37.0625 0.1875C40.4792 0.145833 43.3333 0.0833333 45.625 0C45.75 0.895833 45.9062 1.76042 46.0938 2.59375C46.2812 3.40625 46.5938 4.3125 47.0312 5.3125L47.9688 7.4375L50.25 11.875C50.1042 12.2083 49.7396 12.4896 49.1562 12.7188C48.4479 11.4062 47.5833 10.1562 46.5625 8.96875C45.5417 7.78125 44.2396 6.70833 42.6562 5.75C41.0938 4.79167 39.1771 3.98958 36.9062 3.34375C34.6562 2.69792 31.9375 2.26042 28.75 2.03125C28.6458 4.63542 28.5625 7.58333 28.5 10.875C28.4583 14.1458 28.4375 17.7917 28.4375 21.8125C28.4375 25.8542 28.4583 29.5208 28.5 32.8125C28.5625 36.1042 28.6458 39.0521 28.75 41.6562C28.7708 42.1562 28.9688 42.5833 29.3438 42.9375C29.7188 43.2708 30.2292 43.5521 30.875 43.7812C31.5417 44.0104 32.3021 44.1979 33.1562 44.3438C34.0312 44.4688 34.9688 44.5729 35.9688 44.6562C36.0521 45.0104 36.0938 45.2917 36.0938 45.5C36.0938 45.6875 36.0521 45.8958 35.9688 46.125C32.4688 46 28.8438 45.9375 25.0938 45.9375C21.3646 45.9375 17.7396 46 14.2188 46.125C14.1354 45.8958 14.0938 45.6875 14.0938 45.5C14.0938 45.2917 14.1354 45.0104 14.2188 44.6562L15.7188 44.5C16.2604 44.4375 16.8646 44.3542 17.5312 44.25C18.1979 44.125 18.8125 43.9583 19.375 43.75C19.9583 43.5417 20.4479 43.2812 20.8438 42.9688C21.2396 42.6562 21.4375 42.2708 21.4375 41.8125V41.6562C21.5417 37.8438 21.625 34.2917 21.6875 31C21.75 27.7083 21.7812 24.6458 21.7812 21.8125C21.7812 19 21.75 15.9583 21.6875 12.6875C21.625 9.39583 21.5417 5.84375 21.4375 2.03125C18.4375 2.19792 15.8229 2.60417 13.5938 3.25C11.3854 3.875 9.46875 4.66667 7.84375 5.625C6.21875 6.5625 4.86458 7.64583 3.78125 8.875C2.69792 10.0833 1.80208 11.3646 1.09375 12.7188C0.510417 12.4896 0.145833 12.2083 0 11.875L1.40625 9.21875L2.0625 7.875C2.33333 7.3125 2.60417 6.73958 2.875 6.15625C3.14583 5.57292 3.39583 4.96875 3.625 4.34375C3.875 3.69792 4.08333 3.02083 4.25 2.3125C4.41667 1.58333 4.54167 0.8125 4.625 0ZM56.4505 1.1375H88.4505V7.6015H64.0025V20.2095H85.8905V26.6095H64.0025V39.4735H89.2185V45.9375H56.4505V1.1375ZM127.635 45.9375L114.515 28.2095L101.523 45.9375H93.9065L110.163 23.3455L94.3545 1.1375H102.035L114.579 18.3535L127.379 1.1375H134.675L118.739 23.2175L135.507 45.9375H127.635ZM142.058 46.4495C141.332 46.4495 140.82 46.1082 140.522 45.4255C140.223 44.7428 140.074 43.8255 140.074 42.6735C140.074 41.8202 140.138 40.8602 140.266 39.7935L144.298 2.4175H156.202C161.45 2.4175 165.375 3.29217 167.978 5.0415C170.58 6.79083 171.882 9.69216 171.882 13.7455C171.882 16.2202 171.306 18.4815 170.154 20.5295C169.044 22.5775 167.594 24.3482 165.802 25.8415C164.052 27.3348 162.175 28.4868 160.17 29.2975C158.164 30.1082 156.287 30.5135 154.538 30.5135C154.068 30.5135 153.535 30.3642 152.938 30.0655C152.383 29.7668 151.892 29.3828 151.466 28.9135C151.082 28.4442 150.89 27.9748 150.89 27.5055C150.89 27.0362 151.039 26.7162 151.338 26.5455C151.636 26.3322 151.956 26.2042 152.298 26.1615C154.218 25.7775 156.01 25.1162 157.674 24.1775C159.38 23.1962 160.746 21.9162 161.77 20.3375C162.836 18.7162 163.37 16.7962 163.37 14.5775C163.37 12.6575 162.9 11.1642 161.962 10.0975C161.066 9.03083 159.743 8.28416 157.994 7.8575C156.244 7.43083 154.068 7.2175 151.466 7.2175L147.242 46.4495H142.058Z"

const $ = s => document.querySelector(s)
const $$ = s => [...document.querySelectorAll(s)]

// Helper: split text into character spans
function splitChars(str) {
  return Array.from(str).map(ch => `<span class="char">${ch === ' ' ? '&nbsp;' : ch}</span>`).join('')
}

// -------------------------------------------------------------
// SETUP DOM FROM APP DATA & SCENES
// -------------------------------------------------------------
const DATA = window.TEXP_DATA || { presets: [] }

// End Logo
$('#endLogo').innerHTML = `<path d="${LOGO_D}" fill="currentColor"/>`

// Setup S4 Wheel Items (Preset Wheel Carousel)
const wheel = $('#wheel')
if (wheel && DATA.presets && DATA.presets.length) {
  DATA.presets.forEach((p, i) => {
    const row = document.createElement('div')
    row.className = 'wheel-row'
    row.id = `wrow-${i}`
    row.innerHTML = `<span class="w-name">${p.name}</span><span class="w-cat">${p.category}</span>`
    wheel.appendChild(row)
  })
}

const wheelState = { pos: 7 }
function updateWheel(pos) {
  const rows = $$('.wheel-row')
  if (!rows.length) return
  rows.forEach((row, i) => {
    const offset = i - pos
    if (Math.abs(offset) > 4.5) {
      row.style.display = 'none'
      return
    }
    row.style.display = 'flex'
    const y = offset * 66
    const rotateX = -offset * 12
    const z = -Math.pow(Math.abs(offset), 1.25) * 34
    const scale = Math.max(0.7, 1 - Math.abs(offset) * 0.045)
    const opacity = Math.max(0, 1 - Math.pow(Math.abs(offset) / 4.0, 1.8))
    
    row.style.transform = `translateY(${y.toFixed(1)}px) translateZ(${z.toFixed(1)}px) rotateX(${rotateX.toFixed(1)}deg) scale(${scale.toFixed(3)})`
    row.style.opacity = opacity.toFixed(3)
    
    if (Math.abs(offset) < 0.5) {
      if (!row.classList.contains('active')) row.classList.add('active')
    } else {
      if (row.classList.contains('active')) row.classList.remove('active')
    }
  })
  
  const nearestIdx = Math.max(0, Math.min(DATA.presets.length - 1, Math.round(pos)))
  const p = DATA.presets[nearestIdx]
  if (p) {
    const countEl = $('#wheelCount')
    const catEl = $('#wheelCat')
    if (countEl) countEl.textContent = `${String(nearestIdx + 1).padStart(2, '0')} / 27`
    if (catEl) catEl.textContent = p.category.toUpperCase()
  }
}

updateWheel(7)

// Setup S4 Perform Live Blocks
const perfContainer = $('#perform')
if (perfContainer) {
  perfContainer.innerHTML = `
    <div id="perfBlock3D" class="perf-block">
      <div class="perform-text">${splitChars("3D Flip")}</div>
      <div class="perform-sub mono">GSAP.FROM(CHARS, { ROTATIONX: -90, Y: 30, EASE: 'POWER3.OUT' })</div>
    </div>
    <div id="perfBlockWave" class="perf-block">
      <div class="perform-text">${splitChars("Wave Motion")}</div>
      <div class="perform-sub mono">GSAP.FROM(CHARS, { Y: 40, ROTATION: -15, EASE: 'SINE.INOUT' })</div>
    </div>
    <div id="perfBlockCinematic" class="perf-block">
      <div class="perform-text">${splitChars("Cinematic Entrance")}</div>
      <div class="perform-sub mono">GSAP.FROM(CHARS, { Y: 30, SCALE: 0.95, EASE: 'POWER2.OUT' })</div>
    </div>
  `
}

// Setup S6 Split Rig
const srig = $('#splitRig')
if (srig) {
  srig.innerHTML = `
    <div class="split-plane lines-plane" style="transform: translateZ(110px);">
      <span class="split-tag tag-lines" style="left: 20px; top: -42px;">LINES</span>
      <div style="font-size: 96px; font-weight: 800; color: #60a5fa; opacity: 0.55;">Make it move.</div>
    </div>
    <div class="split-plane words-plane" style="transform: translateZ(0px);">
      <span class="split-tag tag-words" style="left: 20px; top: -42px;">WORDS</span>
      <div style="font-size: 96px; font-weight: 800; color: #f472b6; opacity: 0.65; letter-spacing: 0.05em;">Make &nbsp; it &nbsp; move.</div>
    </div>
    <div class="split-plane chars-plane" id="splitCharsPlane" style="transform: translateZ(-110px);">
      <span class="split-tag tag-chars" style="left: 20px; top: -42px;">CHARS [STAGGER: 0.06s]</span>
      <div id="charsLine">${splitChars("Make it move.")}</div>
    </div>`
}

// Setup S9 Wall Cards (15 Distinct Typography Styles)
const wall = $('#wall')
const wallSamples = [
  { name: 'Elastic Pop', font: 'Bebas Neue', text: 'KINETIC TYPE' },
  { name: '3D Flip', font: 'Playfair Display', text: 'Elegance In Motion' },
  { name: 'Glitch', font: 'Space Grotesk', text: 'CYBERPUNK MATRIX' },
  { name: 'Wave', font: 'Pacifico', text: 'Smooth wave flow' },
  { name: 'Bounce In', font: 'Fredoka', text: 'Playful Interface' },
  { name: 'Typewriter', font: 'JetBrains Mono', text: 'const animate = gsap;' },
  { name: 'Cinematic', font: 'Archivo', text: 'PRODUCTION GRADE' },
  { name: 'Curtain', font: 'Anton', text: 'HEADLINE REVEAL' },
  { name: 'Unfold', font: 'Righteous', text: 'DIMENSIONAL' },
  { name: 'Matrix', font: 'Fira Code', text: '01011001 01010011' },
  { name: 'Spiral In', font: 'Bungee', text: 'ROTATE 360' },
  { name: 'Drop In', font: 'Lobster', text: 'Gravity & Bounce' },
  { name: 'Silk Slide', font: 'Sora', text: 'Fluid Experience' },
  { name: 'Focus In', font: 'Oswald', text: 'PRECISION DEPTH' },
  { name: 'Pop Scatter', font: 'Permanent Marker', text: 'RAW ENERGY' }
]
if (wall) {
  wallSamples.forEach(w => {
    const card = document.createElement('div')
    card.className = 'wall-card'
    card.innerHTML = `
      <div class="wc-text" style="font-family:'${w.font}', sans-serif;">${splitChars(w.text)}</div>
      <div class="wc-foot">
        <span class="wc-preset">✦ ${w.name}</span>
        <span class="wc-font">${w.font}</span>
      </div>`
    wall.appendChild(card)
  })
}

// Setup HUD Titles
const titlesContainer = $('#titles')
const TITLES = [
  { id: 't1', kicker: 'TEXT WORKSPACE', text: 'Animate text with <em>GSAP.</em>' },
  { id: 't2', kicker: 'PRESETS LIBRARY', text: '27 built-in <em>motion presets.</em>' },
  { id: 't3', kicker: 'FINE-GRAIN CONTROL', text: 'Tune every curve <em>and easing.</em>' },
  { id: 't4', kicker: 'SPLIT-TEXT ENGINE', text: 'Split chars, <em>words, or lines.</em>' },
  { id: 't5', kicker: 'MULTI-TRACK SEQUENCER', text: 'Sequence on <em>a real timeline.</em>' },
  { id: 't6', kicker: 'PRODUCTION EXPORT', text: 'One-click clean code <em>for any stack.</em>' },
  { id: 't7', kicker: '71 FONTS · 27 PRESETS', text: 'Infinite kinetic <em>possibilities.</em>' }
]
if (titlesContainer) {
  TITLES.forEach(t => {
    titlesContainer.innerHTML += `
      <div class="title-card" id="title-${t.id}">
        <div class="title-kicker"><i></i><span>${t.kicker}</span></div>
        <div class="title-main">${t.text}</div>
      </div>`
  })
}

// Canvas Live Actor Texts
$('#textStatic').innerHTML = splitChars("Static text.")
$('#textMove').innerHTML = splitChars("Make it move.")
$('#tlTextBounce').innerHTML = splitChars("Intro · Bounce")
$('#tlTextSlide').innerHTML = splitChars("Sequel · Slide Up")



// -------------------------------------------------------------
// MASTER DETERMINISTIC GSAP TIMELINE (10 BEATS @ 120 BPM)
// -------------------------------------------------------------
const TL = gsap.timeline({
  paused: true,
  onUpdate: () => {
    if (typeof updateWheel === 'function' && typeof wheelState !== 'undefined') {
      updateWheel(wheelState.pos)
    }
  }
})

const cam = $('#cam')
const world1 = $('#world')
const world2 = $('#world2')
const cursor1 = $('#cursor1')
const cursor2 = $('#cursor2')

const moveChars = $$('#textMove .char')

// Initial state at t = 0
TL.set(cam, { scale: 2.32, x: 8, y: -4, transformOrigin: "940px 560px" }, 0)
TL.set('#textStatic', { opacity: 1 }, 0)
TL.set('#textMove', { opacity: 0 }, 0)
TL.set('#tinStatic', { opacity: 1 }, 0)
TL.set('#tinMove', { opacity: 0 }, 0)
TL.set('#inspOverlay', { opacity: 0 }, 0)
TL.set('#plate3dFlip', { opacity: 0 }, 0)
TL.set('#plateGlitch', { opacity: 0 }, 0)
TL.set('#presetHighlight', { opacity: 0, top: 230 }, 0)
TL.set(cursor1, { opacity: 0 }, 0)
TL.set(cursor2, { opacity: 0 }, 0)
TL.set('#endCursor', { opacity: 0 }, 0)
TL.set('#ctaRing', { opacity: 0, scale: 0.2 }, 0)
TL.set(['#endLogo', '#endTag', '#ctaBtn', '#endUrl'], { opacity: 0 }, 0)
TL.set('#copiedPill', { opacity: 0 }, 0)
TL.set('#transLiveBadge', { textContent: 'to · power1.out · 1s' }, 0)
TL.set('#playhead', { left: 342 }, 0)
TL.set('#phLabel', { textContent: '0.00' }, 0)
TL.set(wheelState, { pos: 7 }, 0)
TL.call(() => updateWheel(7), null, 0)

// =============================================================
// BEAT 1 (0.00 – 1.90s): Macro Type & Elastic Pop
// =============================================================
// Caret blinks at right edge of "Static text."
TL.fromTo('#caret1', { opacity: 0 }, { opacity: 1, repeat: 3, duration: 0.22, yoyo: true, ease: "steps(1)" }, 0)

// Caret selection sweep across "Static text."
TL.to('#selWash', { opacity: 0.95, duration: 0.35, ease: "power2.inOut" }, 0.50)
TL.to('#caret1', { x: -390, duration: 0.35, ease: "power2.inOut" }, 0.50)

// Continuous subtle organic drift so camera never holds statically
TL.to(cam, { scale: 2.18, x: -8, y: 4, duration: 1.88, ease: "power1.inOut" }, 0)

// Switch from Static to Move at 0.85s (100% deterministic)
TL.set('#textStatic', { opacity: 0 }, 0.85)
TL.set('#textMove', { opacity: 1 }, 0.85)
TL.set('#tinStatic', { opacity: 0 }, 0.85)
TL.set('#tinMove', { opacity: 1 }, 0.85)
TL.set('#selWash', { opacity: 0 }, 0.85)
TL.set('#caret1', { x: 0 }, 0.85)

// Elastic Pop spring on "Make it move." characters
TL.fromTo(moveChars, 
  { scale: 0, opacity: 0 },
  { scale: 1, opacity: 1, duration: 0.95, ease: "elastic.out(1.15, 0.45)", stagger: { each: 0.045, from: "center" }, immediateRender: false },
  0.88
)

// =============================================================
// BEAT 2 (1.90 – 3.20s): Seamless Pull-Back & HUD Reveal
// =============================================================
// Smooth cinematic pullback revealing full Obsidian Instrument UI
TL.to(cam, {
  scale: 1,
  x: 0,
  y: 0,
  duration: 1.25,
  ease: "expo.out"
}, 1.90)

// HUD Title 1 enters with subtle spring
TL.fromTo('#title-t1',
  { opacity: 0, y: 24, scale: 0.96 },
  { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "back.out(1.4)" },
  2.05
)
TL.to('#title-t1', { opacity: 0, y: -16, duration: 0.25, ease: "power2.in" }, 2.85)

// Seamless camera bridge into Beat 3 starting at 3.10s (zero static hold)
TL.to(cam, { scale: 1.15, x: 130, y: -15, duration: 1.15, ease: "power2.inOut" }, 3.10)

// =============================================================
// BEAT 3 (3.20 – 5.40s): Presets Interaction (Cause → Effect)
// =============================================================
// Continuous organic camera drift during interaction
TL.to(cam, { scale: 1.18, x: 140, y: -20, duration: 2.10, ease: "sine.inOut" }, 3.20)

// 1. Preset 1: Bounce In (Card 0, y=250)
TL.set(cursor1, { opacity: 1, x: 650, y: 480 }, 3.15)
TL.to(cursor1, { x: 177, y: 250, duration: 0.35, ease: "power2.out" }, 3.15)
TL.to(cursor1, { scale: 0.82, duration: 0.06, yoyo: true, repeat: 1 }, 3.32)
TL.set('#presetHighlight', { top: 230, opacity: 1 }, 3.30)
TL.set('#transLiveBadge', { textContent: 'from · Bounce In · bounce.out · 0.8s' }, 3.32)
TL.fromTo(moveChars,
  { y: -70, scale: 0.35, opacity: 0 },
  { y: 0, scale: 1, opacity: 1, duration: 0.40, ease: "bounce.out", stagger: 0.02, immediateRender: false },
  3.34
)

// 2. Preset 2: Zoom Rotate (Card 4, y=434)
TL.to(cursor1, { x: 177, y: 434, duration: 0.28, ease: "power2.inOut" }, 3.48)
TL.to('#presetHighlight', { top: 414, duration: 0.24, ease: "power2.inOut" }, 3.52)
TL.to(cursor1, { scale: 0.82, duration: 0.06, yoyo: true, repeat: 1 }, 3.76)
TL.set('#transLiveBadge', { textContent: 'from · Zoom Rotate · back.out · 0.7s' }, 3.76)
TL.fromTo(moveChars,
  { scale: 0.15, rotation: -140, opacity: 0 },
  { scale: 1, rotation: 0, opacity: 1, duration: 0.40, ease: "back.out(1.6)", stagger: 0.02, immediateRender: false },
  3.78
)

// 3. Preset 3: 3D Flip (Card 7, y=572)
TL.to(cursor1, { x: 177, y: 572, duration: 0.28, ease: "power2.inOut" }, 3.92)
TL.to('#presetHighlight', { top: 552, duration: 0.24, ease: "power2.inOut" }, 3.96)
TL.to(cursor1, { scale: 0.82, duration: 0.06, yoyo: true, repeat: 1 }, 4.20)
TL.set('#transLiveBadge', { textContent: 'from · 3D Flip · power3.out · 0.8s' }, 4.20)
TL.fromTo(moveChars,
  { rotationX: -90, y: 30, scale: 0.85, opacity: 0 },
  { rotationX: 0, y: 0, scale: 1, opacity: 1, duration: 0.40, ease: "power3.out", stagger: 0.02, immediateRender: false },
  4.22
)

// 4. Preset 4: Wave (Card 9, y=664)
TL.to(cursor1, { x: 177, y: 664, duration: 0.28, ease: "power2.inOut" }, 4.36)
TL.to('#presetHighlight', { top: 644, duration: 0.24, ease: "power2.inOut" }, 4.40)
TL.to(cursor1, { scale: 0.82, duration: 0.06, yoyo: true, repeat: 1 }, 4.64)
TL.set('#transLiveBadge', { textContent: 'from · Wave · sine.inOut · 0.6s' }, 4.64)
TL.fromTo(moveChars,
  { y: 35, rotation: -12, opacity: 0 },
  { y: 0, rotation: 0, opacity: 1, duration: 0.42, ease: "sine.inOut", stagger: { each: 0.03, from: "start" }, immediateRender: false },
  4.66
)

// Cursor exit & highlight fade
TL.to(cursor1, { opacity: 0, duration: 0.20 }, 5.08)
TL.to('#presetHighlight', { opacity: 0, duration: 0.20 }, 5.08)

// HUD Title 2
TL.fromTo('#title-t2',
  { opacity: 0, y: 24, scale: 0.96 },
  { opacity: 1, y: 0, scale: 1, duration: 0.50, ease: "back.out(1.4)" },
  3.25
)
TL.to('#title-t2', { opacity: 0, y: -16, duration: 0.25, ease: "power2.in" }, 5.10)

// =============================================================
// BEAT 4 (5.40 – 7.40s): 3D Kinetic Preset Drum & Live Performance
// Seamless perspective dive into wheel carousel
// =============================================================
TL.to(cam, { scale: 1.38, x: 280, y: -30, duration: 0.45, ease: "power2.in" }, 5.25)
TL.to(world1, { opacity: 0, duration: 0.35, ease: "power1.inOut" }, 5.35)
TL.set('#wheelScene', { opacity: 1, pointerEvents: 'auto' }, 5.35)
TL.fromTo('#wheelWrap',
  { rotateY: 28, rotateX: 10, scale: 0.9, opacity: 0 },
  { rotateY: 18, rotateX: 4, scale: 1, opacity: 1, duration: 0.45, ease: "power2.out" },
  5.35
)

// Reset wheel position to 7 (3D Flip) at scene start
TL.call(() => updateWheel(7), null, 5.35)

// 1. Initial State: 3D Flip (5.35 – 5.55s)
// Left drum highlights [3D Flip]; right side animates 3D Flip perspective entrance
TL.set('#perfBlock3D', { opacity: 1 }, 5.35)
TL.set('#perfBlockWave', { opacity: 0 }, 5.35)
TL.set('#perfBlockCinematic', { opacity: 0 }, 5.35)
TL.fromTo('#perfBlock3D .char',
  { rotationX: -90, y: 25, opacity: 0 },
  { rotationX: 0, y: 0, opacity: 1, duration: 0.25, ease: "power3.out", stagger: 0.02, immediateRender: false },
  5.35
)

// 2. Transition from 3D Flip to Wave (5.48 – 5.95s)
// Wheel rolls smoothly from 7 (3D Flip) to 9 (Wave)
TL.fromTo(wheelState,
  { pos: 7 },
  {
    pos: 9,
    duration: 0.42,
    ease: "power2.inOut",
    onUpdate: () => updateWheel(wheelState.pos)
  },
  5.48
)
TL.to('#perfBlock3D', { opacity: 0, duration: 0.10, ease: "power1.out" }, 5.52)
TL.set('#perfBlockWave', { opacity: 1 }, 5.58)
TL.fromTo('#perfBlockWave .char',
  { y: 40, rotation: -18, opacity: 0 },
  { y: 0, rotation: 0, opacity: 1, duration: 0.55, ease: "sine.inOut", stagger: 0.035, immediateRender: false },
  5.60
)

// 3. Transition from Wave to Cinematic (5.95 – 6.65s)
// Wheel rolls smoothly from 9 (Wave) to 5 (Cinematic)
TL.to(wheelState, {
  pos: 5,
  duration: 0.42,
  ease: "power2.inOut",
  onUpdate: () => updateWheel(wheelState.pos)
}, 5.95)
TL.to('#perfBlockWave', { opacity: 0, duration: 0.12, ease: "power1.out" }, 6.12)
TL.set('#perfBlockCinematic', { opacity: 1 }, 6.32)
TL.fromTo('#perfBlockCinematic .char',
  { y: 35, scale: 0.92, opacity: 0 },
  { y: 0, scale: 1, opacity: 1, duration: 0.60, ease: "power2.out", stagger: { each: 0.045, from: "center" }, immediateRender: false },
  6.35
)

// 4. Accelerate wheel through library into fade-out (6.70 – 7.15s)
TL.to(wheelState, {
  pos: 8,
  duration: 0.35,
  ease: "power2.in",
  onUpdate: () => updateWheel(wheelState.pos)
}, 6.70)
TL.to('#perfBlockCinematic', { scale: 1.08, opacity: 0, duration: 0.25, ease: "power2.in" }, 6.75)

// Seamless camera transition across canvas into Inspector (Eliminates abrupt cut & ghosting)
TL.to('#wheelScene', { scale: 1.25, opacity: 0, duration: 0.30, ease: "power2.in" }, 6.85)
TL.set('#wheelScene', { opacity: 0, pointerEvents: 'none' }, 7.15)

TL.set(world1, { opacity: 1 }, 7.15)
TL.set('#plate3dFlip', { opacity: 0 }, 7.15)
TL.set('#plateGlitch', { opacity: 0 }, 7.15)
TL.set('#inspOverlay', { opacity: 1 }, 7.15)

// Continuous sweeping camera pan from left to right directly into Inspector controls!
TL.fromTo(cam,
  { scale: 1.30, x: -100, y: 20 },
  { scale: 1.48, x: -740, y: 80, duration: 0.65, ease: "power3.out" },
  7.15
)

// =============================================================
// BEAT 5 (7.40 – 9.80s): Inspector Bezier Hero Shot & Tuning
// =============================================================
// Slow continuous drift during the shot
TL.to(cam, { scale: 1.52, x: -750, y: 70, duration: 2.2, ease: "none" }, 7.60)

// ---- State-driven bezier editor: one ease object renders everything ----
const cp = $('#curvePath')
const ghost = $('#curveGhost')
const h1 = $('#h1'), h2 = $('#h2')
const c1 = $('#c1'), c2 = $('#c2')
const c1ring = $('#c1ring'), c2ring = $('#c2ring')
const cdot = $('#cdot')
const easeVal = $('#easeVal')

const EZ0 = { x1: 0.25, y1: 0.46, x2: 0.45, y2: 0.94 }   // power1.out-ish (matches plate readout)
const EZ1 = { x1: 0.16, y1: 1.00, x2: 0.30, y2: 1.00 }   // snappy expo-style out
const ez = { ...EZ0 }
const ride = { p: 0 }

// ease space (0..1) -> svg viewBox space
const sx = u => 20 + u * 266
const sy = v => 200 - v * 180
// svg space -> world1 coordinates (curvebox at 1597,244 with 1px border, uniform scale 221/223)
const SVG_S = 221 / 223
const toWorld = (x, y) => ({ x: 1598.3 + x * SVG_S, y: 245 + y * SVG_S })

function bezierD(e) {
  return `M 20 200 C ${sx(e.x1).toFixed(2)} ${sy(e.y1).toFixed(2)}, ${sx(e.x2).toFixed(2)} ${sy(e.y2).toFixed(2)}, 286 20`
}
function bezierPoint(e, t) {
  const mt = 1 - t
  const a = mt * mt * mt, b = 3 * mt * mt * t, c = 3 * mt * t * t, d = t * t * t
  return {
    x: a * 20 + b * sx(e.x1) + c * sx(e.x2) + d * 286,
    y: a * 200 + b * sy(e.y1) + c * sy(e.y2) + d * 20
  }
}
function renderCurve() {
  const ax = sx(ez.x1), ay = sy(ez.y1), bx = sx(ez.x2), by = sy(ez.y2)
  cp.setAttribute('d', bezierD(ez))
  h1.setAttribute('x1', 20); h1.setAttribute('y1', 200); h1.setAttribute('x2', ax); h1.setAttribute('y2', ay)
  h2.setAttribute('x1', 286); h2.setAttribute('y1', 20); h2.setAttribute('x2', bx); h2.setAttribute('y2', by)
  c1.setAttribute('cx', ax); c1.setAttribute('cy', ay)
  c2.setAttribute('cx', bx); c2.setAttribute('cy', by)
  c1ring.setAttribute('cx', ax); c1ring.setAttribute('cy', ay)
  c2ring.setAttribute('cx', bx); c2ring.setAttribute('cy', by)
  const pt = bezierPoint(ez, ride.p)
  cdot.setAttribute('cx', pt.x); cdot.setAttribute('cy', pt.y)
  easeVal.textContent = `${ez.x1.toFixed(2)}, ${ez.y1.toFixed(2)}, ${ez.x2.toFixed(2)}, ${ez.y2.toFixed(2)}`
}
ghost.setAttribute('d', bezierD(EZ0))
renderCurve()

const c1Start = toWorld(sx(EZ0.x1), sy(EZ0.y1)), c1End = toWorld(sx(EZ1.x1), sy(EZ1.y1))
const c2Start = toWorld(sx(EZ0.x2), sy(EZ0.y2)), c2End = toWorld(sx(EZ1.x2), sy(EZ1.y2))

// Reset to the initial curve whenever the beat (re)starts — keeps scrubbing deterministic
TL.set(ez, { ...EZ0, onComplete: renderCurve }, 7.10)
TL.set(ride, { p: 0 }, 7.10)

// Cursor enters and glides onto handle C1
TL.set(cursor1, { opacity: 1, x: 1770, y: 430, scale: 1 }, 7.40)
TL.to(cursor1, { x: c1Start.x, y: c1Start.y, duration: 0.40, ease: "power3.out" }, 7.40)

// Press C1: handle swells, grab ring pops, dashed "before" curve appears
TL.to(cursor1, { scale: 0.85, duration: 0.07, ease: "power2.out" }, 7.80)
TL.to(c1, { attr: { r: 7 }, duration: 0.12, ease: "back.out(3)" }, 7.80)
TL.fromTo(c1ring, { opacity: 0, attr: { r: 6 } }, { opacity: 0.9, attr: { r: 12 }, duration: 0.22, ease: "power2.out", immediateRender: false }, 7.80)
TL.to(ghost, { opacity: 1, duration: 0.25, ease: "power1.out" }, 7.82)

// Drag C1 up/left — curve, handle line and readout all follow the same state
TL.to(ez, { x1: EZ1.x1, y1: EZ1.y1, duration: 0.44, ease: "power2.inOut", onUpdate: renderCurve }, 7.86)
TL.to(cursor1, { x: c1End.x, y: c1End.y, duration: 0.44, ease: "power2.inOut" }, 7.86)

// Release C1
TL.to(cursor1, { scale: 1, duration: 0.08 }, 8.30)
TL.to(c1, { attr: { r: 5 }, duration: 0.12, ease: "power2.out" }, 8.30)
TL.to(c1ring, { opacity: 0, attr: { r: 16 }, duration: 0.20, ease: "power1.out" }, 8.30)

// Glide to C2 and press
TL.to(cursor1, { x: c2Start.x, y: c2Start.y, duration: 0.20, ease: "power2.inOut" }, 8.32)
TL.to(cursor1, { scale: 0.85, duration: 0.07, ease: "power2.out" }, 8.52)
TL.to(c2, { attr: { r: 7 }, duration: 0.12, ease: "back.out(3)" }, 8.52)
TL.fromTo(c2ring, { opacity: 0, attr: { r: 6 } }, { opacity: 0.9, attr: { r: 12 }, duration: 0.22, ease: "power2.out", immediateRender: false }, 8.52)

// Drag C2 to lock in the snappy settle
TL.to(ez, { x2: EZ1.x2, y2: EZ1.y2, duration: 0.39, ease: "power2.inOut", onUpdate: renderCurve }, 8.56)
TL.to(cursor1, { x: c2End.x, y: c2End.y, duration: 0.39, ease: "power2.inOut" }, 8.56)

// Release C2
TL.to(cursor1, { scale: 1, duration: 0.08 }, 8.95)
TL.to(c2, { attr: { r: 5 }, duration: 0.12, ease: "power2.out" }, 8.95)
TL.to(c2ring, { opacity: 0, attr: { r: 16 }, duration: 0.20, ease: "power1.out" }, 8.95)

// Preview: curve flashes lime and a glowing dot rides the NEW curve
TL.to(cp, { stroke: "#bdf524", duration: 0.12, ease: "power1.out" }, 8.95)
TL.set(cdot, { opacity: 1 }, 8.97)
TL.to(ride, { p: 1, duration: 0.50, ease: "none", onUpdate: renderCurve }, 8.97)
TL.to(cdot, { opacity: 0, duration: 0.15 }, 9.47)
TL.to(cp, { stroke: "#ffffff", duration: 0.25, ease: "power1.inOut" }, 9.47)
TL.to(ghost, { opacity: 0, duration: 0.25 }, 9.47)

// Duration scrub drag in Inspector (row at world y≈605)
const slFill = $('#sl-duration .sl-fill')
const slVal = $('#slDurVal')
TL.to(cursor1, { x: 1705, y: 605, duration: 0.20, ease: "power2.inOut" }, 9.02)
TL.to(cursor1, { scale: 0.85, duration: 0.06 }, 9.22)
TL.to(slFill, { width: '60%', duration: 0.26, ease: "power2.inOut", onUpdate: function() {
  slVal.textContent = (1.0 + this.progress() * 0.4).toFixed(1)
} }, 9.24)
TL.to(cursor1, { x: 1782, y: 605, duration: 0.26, ease: "power2.inOut" }, 9.24)
TL.to(cursor1, { scale: 1, opacity: 0, duration: 0.2 }, 9.52)

// HUD Title 3
TL.fromTo('#title-t3',
  { opacity: 0, y: 24, scale: 0.96 },
  { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "back.out(1.4)" },
  7.45
)
TL.to('#title-t3', { opacity: 0, y: -16, duration: 0.35, ease: "power2.in" }, 9.40)

// Seamless camera pull-back from Inspector toward center canvas into Beat 6
TL.to(cam, { scale: 1.12, x: 0, y: 0, duration: 0.45, ease: "power2.inOut" }, 9.40)
TL.set('#inspOverlay', { opacity: 0 }, 9.75)
TL.to(world1, { opacity: 0, duration: 0.30, ease: "power1.in" }, 9.70)

// =============================================================
// BEAT 6 (9.80 – 11.90s): Registered 3D Split Planes
// =============================================================
TL.set('#splitScene', { opacity: 1, pointerEvents: 'auto' }, 9.75)

// Animate 3D split planes expanding apart with smooth dynamic rotation
TL.fromTo('#splitCam',
  { rotateX: 28, rotateY: -20, scale: 0.95 },
  { rotateX: 16, rotateY: -10, scale: 1.1, duration: 2.0, ease: "power1.out" },
  9.75
)

TL.fromTo('.lines-plane', { z: 0, opacity: 0 }, { z: 120, opacity: 0.55, duration: 0.7, ease: "expo.out" }, 9.90)
TL.fromTo('.words-plane', { z: 0, opacity: 0 }, { z: 0, opacity: 0.75, duration: 0.7, ease: "expo.out" }, 10.05)
TL.fromTo('.chars-plane', { z: 0, opacity: 0 }, { z: -120, opacity: 1, duration: 0.7, ease: "expo.out" }, 10.20)

// Stagger pulse across characters (center -> out) with deterministic keyframes
const splitCharsList = $$('#charsLine .char')
TL.to(splitCharsList, {
  keyframes: [
    { scale: 1.20, color: "#bdf524", borderColor: "#bdf524", boxShadow: "0 0 20px rgba(189,245,36,0.5)", duration: 0.18, ease: "power2.out" },
    { scale: 1.00, color: "#ffffff", borderColor: "rgba(255,255,255,0.1)", boxShadow: "0 0 0px rgba(0,0,0,0)", duration: 0.18, ease: "power2.in" }
  ],
  stagger: { each: 0.035, from: "center" }
}, 10.45)

// HUD Title 4
TL.fromTo('#title-t4',
  { opacity: 0, y: 24, scale: 0.96 },
  { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "back.out(1.4)" },
  9.90
)
// Outgoing title clears early so it NEVER collides with upcoming UI
TL.to('#title-t4', { opacity: 0, y: -16, duration: 0.30, ease: "power2.in" }, 11.05)

// Signature Collapse: planes fold inward into unified hero sentence
TL.to('.lines-plane', { z: -120, opacity: 0, duration: 0.40, ease: "power2.inOut" }, 11.15)
TL.to('.words-plane', { z: -120, opacity: 0, duration: 0.40, ease: "power2.inOut" }, 11.20)
TL.to('#splitCam', { rotateX: 0, rotateY: 0, scale: 1.0, duration: 0.45, ease: "power2.out" }, 11.20)

// Seamless cross-fade from unified sentence directly into authentic Timeline workspace
TL.to('#splitScene', { scale: 0.94, opacity: 0, duration: 0.38, ease: "power2.inOut" }, 11.60)
TL.set('#splitScene', { pointerEvents: 'none' }, 11.98)

// =============================================================
// BEAT 7 (11.95 – 14.50s): Authentic Timeline Mode & Sequencer
// =============================================================
TL.set(world1, { opacity: 0 }, 11.55)
TL.set(cursor1, { opacity: 0 }, 11.55)
TL.set(cam, { scale: 1, x: 0, y: 0 }, 11.55)
TL.fromTo(world2,
  { opacity: 0, scale: 1.04 },
  { opacity: 1, scale: 1, duration: 0.42, ease: "power2.out", pointerEvents: 'auto' },
  11.60
)

// Playhead sweeps across authentic sequencer lanes from x=342px to 950px
const playhead = $('#playhead')
const phLabel = $('#phLabel')

TL.fromTo(playhead,
  { left: 342 },
  { left: 950, duration: 2.20, ease: "power1.inOut" },
  12.10
)
TL.to({}, {
  duration: 2.20,
  ease: "power1.inOut",
  onUpdate: function() {
    phLabel.textContent = (this.progress() * 3.4).toFixed(2)
  }
}, 12.10)

// Subtle continuous forward camera push during sequencer playback
TL.to(cam, { scale: 1.03, duration: 2.20, ease: "none" }, 12.10)

// Preview canvas triggers animations as playhead crosses (deterministic separate nodes)
TL.set('#tlTextBounce', { opacity: 1 }, 12.10)
TL.set('#tlTextSlide', { opacity: 0 }, 12.10)
TL.fromTo('#tlTextBounce .char',
  { y: -80, scale: 0.3, opacity: 0 },
  { y: 0, scale: 1, opacity: 1, duration: 0.65, ease: "bounce.out", stagger: 0.04, immediateRender: false },
  12.15
)

TL.set('#tlTextBounce', { opacity: 0 }, 13.00)
TL.set('#tlTextSlide', { opacity: 1 }, 13.00)
TL.fromTo('#tlTextSlide .char',
  { y: 60, opacity: 0 },
  { y: 0, opacity: 1, duration: 0.45, ease: "expo.out", stagger: 0.025, immediateRender: false },
  13.05
)

// Cursor glides up to top-right </> Get Code button at (1788, 27)
TL.set(cursor2, { opacity: 1, x: 1420, y: 240 }, 13.70)
TL.to(cursor2, { x: 1788, y: 27, duration: 0.50, ease: "power2.out" }, 13.72)
TL.to(cursor2, { scale: 0.82, duration: 0.08, yoyo: true, repeat: 1 }, 14.28)

// HUD Title 5
TL.fromTo('#title-t5',
  { opacity: 0, y: 24, scale: 0.96 },
  { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "back.out(1.4)" },
  12.10
)
TL.to('#title-t5', { opacity: 0, y: -16, duration: 0.35, ease: "power2.in" }, 14.25)

// =============================================================
// BEAT 8 (14.50 – 17.50s): Authentic Code Export Dialog Switching
// =============================================================
TL.to('#dim', { opacity: 1, pointerEvents: 'auto', duration: 0.3 }, 14.40)
TL.fromTo('#dialog',
  { opacity: 0, scale: 0.85 },
  { opacity: 1, scale: 1, pointerEvents: 'auto', duration: 0.45, ease: "back.out(1.5)" },
  14.45
)
// Subtle 1% slow camera drift during dialog exploration
TL.to(cam, { scale: 1.06, x: -10, duration: 3.0, ease: "none" }, 14.50)

// Cursor switches chips: React -> Vue at (805, 330)
TL.to(cursor2, { x: 805, y: 330, duration: 0.5, ease: "power2.out" }, 14.75)
TL.to(cursor2, { scale: 0.82, duration: 0.08, yoyo: true, repeat: 1 }, 15.25)
TL.to('#modalVue', { opacity: 1, duration: 0.08 }, 15.30)
TL.to('#modalReact', { opacity: 0, duration: 0.08 }, 15.30)

// Cursor switches chips: Vue -> React at (725, 330)
TL.to(cursor2, { x: 725, y: 330, duration: 0.45, ease: "power2.out" }, 15.55)
TL.to(cursor2, { scale: 0.82, duration: 0.08, yoyo: true, repeat: 1 }, 16.00)
TL.to('#modalReact', { opacity: 1, duration: 0.08 }, 16.05)
TL.to('#modalVue', { opacity: 0, duration: 0.08 }, 16.05)

// Cursor moves to Copy button at (1268, 443) and clicks
TL.to(cursor2, { x: 1268, y: 443, duration: 0.45, ease: "power2.out" }, 16.20)
TL.to(cursor2, { scale: 0.82, duration: 0.08, yoyo: true, repeat: 1 }, 16.65)
TL.fromTo('#copiedPill',
  { opacity: 0, scale: 0.7 },
  { opacity: 1, scale: 1, duration: 0.22, ease: "back.out(2)" },
  16.70
)

// Cursor exit before Beat 9
TL.to(cursor2, { opacity: 0, duration: 0.25 }, 17.15)

// HUD Title 6
TL.fromTo('#title-t6',
  { opacity: 0, y: 24, scale: 0.96 },
  { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "back.out(1.4)" },
  14.65
)
TL.to('#title-t6', { opacity: 0, y: -16, duration: 0.35, ease: "power2.in" }, 17.15)

// =============================================================
// BEAT 9 (17.50 – 19.40s): Perspective Fold & 3D Output Wall
// =============================================================
TL.to('#dialog', { scaleY: 0.01, scaleX: 1.1, opacity: 0, duration: 0.35, ease: "power3.in" }, 17.35)
TL.to('#dim', { opacity: 0, duration: 0.25 }, 17.45)
TL.set('#strip', { scaleX: 1 }, 17.50)
TL.to('#strip', { scaleY: 280, opacity: 0, duration: 0.35, ease: "power4.out" }, 17.55)

// Wall scene enters with dynamic 3D camera push
TL.set(world2, { opacity: 0, pointerEvents: 'none' }, 17.55)
TL.set('#wallScene', { opacity: 1, pointerEvents: 'auto' }, 17.55)

TL.fromTo('#wallCam',
  { z: -350, scale: 0.9, rotateZ: -2, opacity: 0 },
  { z: 280, scale: 1.25, rotateZ: 0, opacity: 1, duration: 1.7, ease: "power2.out" },
  17.55
)

// Animate wall card texts
$$('.wall-card').forEach((wc, i) => {
  const chars = wc.querySelectorAll('.char')
  TL.fromTo(chars,
    { y: 25, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.38, ease: "power2.out", stagger: 0.012, immediateRender: false },
    17.60 + (i % 5) * 0.05
  )
})

// HUD Title 7
TL.fromTo('#title-t7',
  { opacity: 0, y: 24, scale: 0.96 },
  { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.4)" },
  17.65
)
TL.to('#title-t7', { opacity: 0, y: -16, duration: 0.28, ease: "power2.in" }, 18.95)

// =============================================================
// BEAT 10 (19.20 – 24.00s): End Card & CTA Finale
// =============================================================
// Pre-activate End Scene behind the wall
TL.set('#endScene', { opacity: 1, pointerEvents: 'auto' }, 19.10)

// 3D preset wall recedes cleanly into depth without bounding box artifacts
TL.to('#wallCam', { scale: 0.1, z: -600, opacity: 0, duration: 0.30, ease: "power2.in" }, 19.20)
TL.to('#wallScene', { opacity: 0, duration: 0.30, ease: "power2.in" }, 19.20)
TL.set('#wallScene', { opacity: 0, pointerEvents: 'none' }, 19.50)

// Logo springs forward out of the focal point with signature elastic snap
TL.fromTo('#endLogo',
  { scale: 0.45, opacity: 0, y: -20 },
  { scale: 1, opacity: 1, y: 0, duration: 0.65, ease: "elastic.out(1.1, 0.5)", immediateRender: false },
  19.48
)

// Tagline text fade up
TL.fromTo('#endTag',
  { y: 25, opacity: 0 },
  { y: 0, opacity: 1, duration: 0.50, ease: "power2.out", immediateRender: false },
  19.78
)

// CTA Button bounce in
TL.fromTo('#ctaBtn',
  { scale: 0.7, opacity: 0, y: 30 },
  { scale: 1, opacity: 1, y: 0, duration: 0.60, ease: "back.out(1.6)", immediateRender: false },
  20.08
)

// URL & Subtitle
TL.fromTo('#endUrl',
  { opacity: 0, y: 15 },
  { opacity: 0.85, y: 0, duration: 0.45, ease: "power2.out", immediateRender: false },
  20.35
)

// End cursor clicks CTA button (screen coordinates: center of ctaBtn at 960, 621)
const endCur = $('#endCursor')
const ctaRing = $('#ctaRing')
TL.set(endCur, { opacity: 0, x: 1040, y: 720 }, 20.35)
TL.to(endCur, { opacity: 1, x: 960, y: 621, duration: 0.60, ease: "power2.out" }, 20.55)
TL.to(endCur, { scale: 0.82, duration: 0.08, yoyo: true, repeat: 1 }, 21.20)
TL.to('#ctaBtn', { scale: 0.95, duration: 0.08, yoyo: true, repeat: 1 }, 21.20)

// Lime pulse ripple ring (centered on CTA button at x=960, y=621)
TL.fromTo(ctaRing,
  { left: 960, top: 621, xPercent: -50, yPercent: -50, scale: 0.2, opacity: 1 },
  { scale: 2.4, opacity: 0, duration: 0.60, ease: "power2.out", immediateRender: false },
  21.25
)

// End cursor moves away and fades out so end card is clean
TL.to(endCur, { x: 1020, y: 700, opacity: 0, duration: 0.35, ease: "power2.in" }, 21.38)

// Final subtle camera push (2.5% push over the last 2.8s for pure confidence)
TL.to('#endRig', {
  scale: 1.035,
  duration: 2.8,
  ease: "sine.out"
}, 21.20)


// -------------------------------------------------------------
// READY PROMISE & SEEK INTERFACE
// -------------------------------------------------------------
window.seek = function(t) {
  TL.seek(Math.max(0, Math.min(DURATION, t)), false)
  if (typeof updateWheel === 'function' && typeof wheelState !== 'undefined') {
    updateWheel(wheelState.pos)
  }
  if (typeof renderCurve === 'function') renderCurve()
}

window.ready = (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
  window.seek(0)
  if (!window.location.search.includes('render')) {
    TL.play()
  }
  return true
})
