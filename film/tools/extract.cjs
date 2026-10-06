// Transpile the app's own TS modules (presets, code generator) and dump real data for the film.
// No hand-written copies: preset configs and exported code come straight from the repo.
const fs = require('fs'), path = require('path'), Module = require('module')
const ts = require(path.resolve(__dirname, '../../node_modules/typescript'))
const ROOT = path.resolve(__dirname, '../..')

const origResolve = Module._resolveFilename
Module._resolveFilename = function (req, parent, ...rest) {
  if (req.startsWith('@/')) req = path.join(ROOT, req.slice(2))
  try { return origResolve.call(this, req, parent, ...rest) } catch (e) {
    for (const ext of ['.ts', '.tsx', '/index.ts']) { if (fs.existsSync(req + ext)) return req + ext }
    throw e
  }
}
for (const ext of ['.ts', '.tsx']) {
  require.extensions[ext] = (m, filename) => {
    const src = fs.readFileSync(filename, 'utf8')
    const out = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.React, esModuleInterop: true } })
    m._compile(out.outputText, filename)
  }
}

const { ANIMATION_PRESETS } = require(path.join(ROOT, 'lib/presets.ts'))
const store = require(path.join(ROOT, 'store/use-playground-store.ts'))
const { generateCode } = require(path.join(ROOT, 'utils/code-generator.ts'))
const { googleFonts } = require(path.join(ROOT, 'lib/fonts.ts'))

const cinematic = ANIMATION_PRESETS.find(p => p.name === 'Elastic Pop')
const animationConfig = { ...store.defaultAnimationConfig, ...cinematic.animationConfig, customStyles: { ...store.defaultAnimationConfig.customStyles, ...(cinematic.animationConfig.customStyles || {}) } }
const splitTextConfig = { ...store.defaultSplitTextConfig, ...cinematic.splitTextConfig }
const code = {}
for (const framework of ['vanilla', 'react', 'vue']) for (const language of ['js', 'ts']) {
  code[`${framework}-${language}`] = generateCode({ text: 'Make it move.', animationConfig, backgroundConfig: store.defaultBackgroundConfig, splitTextConfig, framework, language }).animation
}
const data = { presets: ANIMATION_PRESETS, defaults: { animation: store.defaultAnimationConfig, split: store.defaultSplitTextConfig }, fonts: googleFonts.map(f => f.name), code, codePreset: cinematic.name }
fs.writeFileSync(path.resolve(__dirname, '../src/data.js'), 'window.TEXP_DATA = ' + JSON.stringify(data, null, 1) + '\n')
console.log('presets', ANIMATION_PRESETS.length, 'fonts', googleFonts.length, 'code variants', Object.keys(code).length)
console.log(code['react-ts'])
