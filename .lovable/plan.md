

## Fix Classic Mode on Interactive Models Page

### Problems Identified

1. **Models hidden behind background**: The page container uses inline `style={{ backgroundColor: 'hsl(0 0% 4%)' }}` and the `PaperDesignBackground` canvas component. The CSS rule hiding canvases (`[data-theme="classic"] [style*="background"] canvas`) may be too broad or insufficient, and the dark inline background isn't being overridden for the page container in classic mode.

2. **Close button vs Theme Switcher clash**: The expanded model's close button is positioned at `top-5 right-5 z-50`, while the ThemeSwitcher sits at `fixed top-4 right-4 z-[9999]`. Both occupy the same top-right corner.

3. **Classic mode needs a custom animated background** instead of the dark shader/noise pattern.

---

### Plan

#### 1. Fix the close button / theme switcher overlap

In `InteractiveModels.tsx`, move the close button from `top-5 right-5` to `top-5 right-20` (or similar offset) so it doesn't overlap the theme switcher. Alternatively, hide the ThemeSwitcher when the fullscreen viewer is open by bumping the expanded viewer's z-index above `z-[9999]` and repositioning the close button to avoid conflict.

The simplest fix: shift the close button leftward (e.g., `right-24`) when in the expanded fullscreen viewer, giving space for the theme switcher.

#### 2. Override page background for Classic Mode

Add CSS rules in `src/index.css` under the Interactive Models section to:
- Force `background-color: #f5f0e8 !important` on the page's root container
- Hide the `PaperDesignBackground` canvas in classic mode (already partially done, but needs strengthening)
- Override all inline dark backgrounds on model slot cards

#### 3. Add animated 8-bit architectural background for Classic Mode

Create a new component `src/components/ClassicArchBackground.tsx` that renders an SVG/CSS-based animated background with:
- A warm parchment-to-cream gradient base
- Floating 8-bit pixel-art architectural elements (parametric grids, wireframe cubes, BIM detail fragments, structural columns) rendered as small SVG shapes
- Elements drift slowly across the screen with CSS keyframe animations
- Low opacity (~0.08-0.12) so they remain subtle and non-intrusive
- Only renders when `data-theme="classic"` is active (using the `useTheme` hook)

The art will emulate:
- Parametric facade grids (repeating pixel rectangles in wave patterns)
- 3D wireframe cubes/boxes (isometric pixel art)
- Structural beam cross-sections
- BIM dimension lines and annotation markers

This component will be placed in `InteractiveModels.tsx`, conditionally rendered in classic mode, replacing the `PaperDesignBackground`.

#### 4. CSS additions in `src/index.css`

Add rules scoped to `[data-theme="classic"]` targeting:
- The page root `.min-h-screen` container with the dark inline style
- Model slot cards to use `#ede8dc` backgrounds
- The fullscreen expanded viewer to keep its dark background (3D models need dark to render properly)
- Gold-colored text elements to use `#8B1A1A` or `#1a1612`

---

### Technical Details

**Files to modify:**
- `src/index.css` -- Add/fix classic mode rules for Interactive Models page
- `src/pages/InteractiveModels.tsx` -- Move close button, conditionally render ClassicArchBackground, use `useTheme` hook
- `src/components/ThemeSwitcher.tsx` -- No changes needed

**Files to create:**
- `src/components/ClassicArchBackground.tsx` -- Animated 8-bit architectural background component

**Animation approach for the 8-bit background:**
- Use CSS `@keyframes` for floating/drifting motion
- Render ~15-20 small SVG architectural icons at random positions
- Each icon has a unique animation delay and duration for organic movement
- Icons include: wireframe cube, parametric grid fragment, I-beam cross section, dimension arrow, brick pattern, truss segment
- All rendered in `#1a1612` at 8-12% opacity on the parchment background

