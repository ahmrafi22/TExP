// Boots `npm run dev` for the TExP repo, waits for http://localhost:3000 to answer,
// runs the given script (default capture.cjs) inside this folder, then stops the server.
//
// Usage (from this folder):  node run-with-server.cjs [script.cjs]
const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')

const REPO = path.resolve(__dirname, '..', '..')
const SCRIPT = process.argv[2] || 'capture.cjs'
const LOG = path.join(__dirname, 'dev-server.log')
// Dedicated port so an unrelated dev server squatting :3000 can't shadow TExP.
const PORT = process.env.TEXP_CAPTURE_PORT || '3117'
const BASE = `http://localhost:${PORT}`

const server = spawn('npm', ['run', 'dev'], {
  cwd: REPO,
  shell: true,
  env: { ...process.env, PORT },
  stdio: ['ignore', fs.openSync(LOG, 'a'), fs.openSync(LOG, 'a')],
})
const sleep = ms => new Promise(r => setTimeout(r, ms))

const waitUp = async () => {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(BASE)
      if (res.status === 200) return true
    } catch {}
    await sleep(2000)
  }
  return false
}

;(async () => {
  const up = await waitUp()
  console.log('[orchestrator] server up:', up)
  if (!up) {
    console.log('[orchestrator] giving up — see dev-server.log')
    try { spawn('taskkill', ['/pid', String(server.pid), '/T', '/F']) } catch {}
    process.exit(1)
  }

  const child = spawn(process.execPath, [path.join(__dirname, SCRIPT)], {
    cwd: __dirname,
    stdio: 'inherit',
    env: { ...process.env, TEXP_URL: BASE },
  })
  const code = await new Promise(r => child.on('close', r))
  console.log('[orchestrator] script exit:', code)

  try {
    if (process.platform === 'win32') spawn('taskkill', ['/pid', String(server.pid), '/T', '/F'])
    else server.kill('SIGTERM')
  } catch {}
  await sleep(1500)
  console.log('[orchestrator] done')
  process.exit(code || 0)
})()
