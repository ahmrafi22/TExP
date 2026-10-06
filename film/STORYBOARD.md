# TExP launch film — STORYBOARD (v1)

1920×1080 · 60 fps · ~24 s · sound-off readable.

**Persistent actor:** the lime caret / playhead. In TExP's design system lime means *live*; in the film it
is the one live thing in every shot: text caret → selection → cursor ring → curve dot → timeline playhead
→ copy check → CTA.

**Second actor:** the canvas sentence "Make it move." It is the hook, it is re-animated by every preset
click, it decomposes in the split shot and plays in the timeline.

**Truth device:** every title is driven by a real TExP preset config pulled from `lib/presets.ts`
(same GSAP vars as `buildTweenVars`, with px offsets scaled to film type size). A small mono kicker
names the preset driving it.

| # | Time | What the viewer sees | Business job | Transition out (carried object) |
|---|---|---|---|---|
| 1 | 0.00–1.90 | Macro type on the dotted canvas: gray "Static text." + lime caret. The caret selects it (lime wash) and retypes "Make it move.", which springs in with **Elastic Pop** | Problem → promise; the output *is* the product | Same object: camera pulls back |
| 2 | 1.90–3.30 | Continuous pull-back with a 3D tilt that settles: the whole TExP workspace (presets, canvas, inspector, transport) lands full-frame. Title "Animate text with GSAP." | What it is | Cursor enters; camera pushes to presets panel |
| 3 | 3.30–5.40 | UI close-up, presets list + canvas: cursor clicks **3D Flip** → canvas replays 3D Flip; clicks **Glitch** → canvas replays Glitch. Selected row gets the lime edge | Pick a recipe, see it live (cause → effect) | Camera dives into the selected row |
| 4 | 5.40–7.40 | Carousel: the row becomes the active item of a tilted wheel of all 27 preset names; each active name animates itself with its own preset, neighbours recede, counter ticks 01/27 → | Breadth | The active "Cinematic" label flies through the camera onto the inspector |
| 5 | 7.40–9.80 | Inspector close-up: cursor drags the bezier handle, the curve morphs, the ease values tick, a lime dot rides the curve; the canvas inset replays with the new curve. Duration slider drag | Tune every tween | Camera pushes into the canvas sentence |
| 6 | 9.80–12.00 | Registered decomposition: the sentence tilts into 3D and lifts into three planes LINES / WORDS / CHARS, then a stagger-from pulse (center → edges → random) runs across the chars | Split text engine | Planes collapse back into one sentence that drops into the timeline preview |
| 7 | 12.00–14.60 | Timeline workspace: three tracks (Intro · Bounce In, Sequel · Slide Up, Outro · Focus In), lime playhead scrubs, preview plays each item | Sequence several animations | Cursor clicks **Get Code** |
| 8 | 14.60–17.60 | Export dialog rises out of the button; real generated code types in; chips switch React → Vue → Vanilla, TS ↔ JS, file badge follows; Copy → check | Export real code | The dialog folds to a luminous strip |
| 9 | 17.60–19.40 | Strip opens into a perspective wall of live tiles, each a different preset in a different font (of the 71) | Range: fonts × presets | Wall collapses to one tile |
| 10 | 19.40–24.00 | End card: TExP wordmark (white) springs together letter by letter; "Text animation, without the guesswork."; CTA pill + repo URL; slow 3% push | The one action | — |

## Three signature transformations
1. The gray static sentence is selected by the caret and *becomes* animated text, then the camera pulls
   back to reveal it was sitting in the TExP canvas all along.
2. The clicked preset row becomes the active item of a 27-name wheel, and each name performs itself.
3. The sentence physically splits into its lines / words / chars planes, then drops into the timeline.

## Title system
Bottom-left, x = 112, Archivo 800 88 px, white on a soft graphite scrim; mono kicker above it with a lime
dot + preset name. Outgoing title clears before the incoming one enters.
