# ESC, the keycap hermit

The homepage's cobalt Esc keycap is a Blender-made mascot with a tiny workshop inside. On phones it is a 96px companion opposite the portrait, with the name below; tablets use 112px. At 1024px it moves into the right page margin at 128px, increasing to 160px at 1280px. It scrolls with the hero and never floats over the mobile dock. The introduction and hiring links keep the full content width. The portrait, interactive name, typed roles, quote, navigation, and space snake retain their existing behavior.

## Files and behavior

- `src/components/esc-mascot.tsx`: native keyboard/touch button, server-rendered WebP poster, open state, visibility-driven lazy loading, reduced-motion and data-saving fallbacks.
- `src/components/esc-mascot-stage.ts`: isolated Three.js renderer, lighting, bounds fitting, reversible workshop clip, bounded eye attention, resource cleanup.
- `public/mascot/esc.glb`: 1,377,004-byte model, 31 material primitives, 73,836 triangles; no external textures or decoder.
- `public/mascot/esc-closed.webp` and `esc-open.webp`: transparent 640px fallbacks, approximately 27 KB and 36 KB.

The heavy renderer is dynamically imported only when the mascot enters the viewport and the browser is idle. The rest of the homepage remains server-rendered. Reduced-motion and Save-Data visitors use the two interactive posters without fetching Three.js or the GLB. Normal mode greets for four seconds, then renders only for pointer attention, opening/closing, or resizing. Rendering pauses while offscreen or while the tab is hidden. Unmounting disposes GPU geometry/materials/environment, the renderer, observers, listeners, and animation actions; a late model response is disposed too.

Click or press Enter/Space on the figure to open or close its workshop. The same button switches posters if WebGL or the model load fails. Its transparent canvas and images work over both site themes. Mobile vertical scrolling remains native.

## Model interface

- `Idle`: a four-second clip.
- `WorkshopOpen`: a one-second clip, zero closed and one fully open. The runtime owns the time of a paused action, so repeated activation reverses safely.
- `Eye_L_Pivot` and `Eye_R_Pivot`: optional additive attention. Local Blender Z remains up beneath the exported glTF parent transform.

The editable Blender scene and builder were delivered separately as the ESC asset project. Export replacements to the same names and preserve these clip/pivot names. Fit both open and closed poses when changing the model; the runtime computes the actual projected geometry bounds for this purpose.

## Checks

Run `npm run lint`, `npx tsc --noEmit`, and `npm run build`. Verify the home route at desktop and phone widths, both themes, keyboard activation, repeated opening/closing, navigation away and back, and the static fallback after WebGL context loss. The original GLB passed Khronos validation with zero errors and zero warnings.
