

## Fix Classic Mode Issues on Interactive Models Page

### Problems

1. **3D models not visible in Classic Mode**: The CSS rule `[data-theme="classic"] .interactive-models-page canvas { display: none !important; }` hides ALL canvases on the page, including the Three.js 3D model canvases. This was intended to hide only the `PaperDesignBackground` canvas, but it catches the model canvases too.

2. **Fullscreen 3D models also broken**: The same CSS rule hides the canvas inside the fullscreen expanded viewer. The background image from `ClassicArchBackground` also bleeds into the expanded view.

3. **Close button overlaps Theme Switcher**: The close button is at `top-5 right-24` and the ThemeSwitcher is at `fixed top-4 right-4 z-[9999]`. From the screenshot, they visually clash.

4. **Controls panel too high**: The controls panel is at `top-16 right-5`, which overlaps with the title/close button area.

---

### Fixes

#### 1. Fix the canvas visibility CSS (src/index.css)

Replace the overly broad rule:
```css
/* BEFORE - hides ALL canvases including 3D models */
[data-theme="classic"] .interactive-models-page canvas {
  display: none !important;
}
```

With a more targeted rule that only hides the background canvas, not the model canvases inside `.model-slot-card` or the fullscreen viewer:
```css
/* Only hide the ClassicArchBackground / PaperDesign background canvas */
[data-theme="classic"] .interactive-models-page > .pointer-events-none canvas,
[data-theme="classic"] .interactive-models-page > div:first-child canvas {
  display: none !important;
}
```

Since the component already conditionally renders `ClassicArchBackground` vs `PaperDesignBackground` based on `isClassic`, and `ClassicArchBackground` uses SVGs (no canvas), the simplest approach is to remove the broad canvas-hiding rule entirely and rely on the conditional rendering that already exists in the component.

#### 2. Lower the close button and controls panel (src/pages/InteractiveModels.tsx)

- Move close button from `top-5 right-24` to `top-14 right-5` (below the ThemeSwitcher instead of beside it)
- Move controls panel from `top-16 right-5` to `top-24 right-5` (below the close button)
- Raise the fullscreen viewer z-index from `z-50` to `z-[9998]` so it sits just below the ThemeSwitcher

#### 3. Ensure fullscreen viewer always uses dark background (src/index.css)

Add a rule to ensure the expanded fullscreen 3D viewer keeps its dark background and does not get the classic parchment treatment, and its canvases remain visible:
```css
[data-theme="classic"] .fixed.inset-0.z-\\[9998\\] canvas {
  display: block !important;
}
```

---

### Files to Modify

- **src/index.css**: Remove the broad `canvas { display: none }` rule; add targeted rules to preserve 3D canvases in model cards and fullscreen viewer
- **src/pages/InteractiveModels.tsx**: Lower close button position, lower controls panel position, bump fullscreen z-index to `z-[9998]`
