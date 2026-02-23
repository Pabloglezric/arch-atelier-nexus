

# Fix: Make Classic Theme MeshGradient Background Visible

## Problem

The `ClassicMeshBackground` (MeshGradient) renders as a `fixed` element at `z-index: 0`, but it is completely hidden because every layer on top of it uses opaque dark backgrounds:

1. **Index page wrapper** -- `backgroundColor: 'hsl(0 0% 4%)'` (near-black, fully opaque)
2. **Hero component** -- has `bg-black` class and the WebGL canvas has `background: 'black'`
3. **Lower sections wrapper** -- `backgroundColor: 'hsl(0 0% 0% / 0.6)'` (60% black overlay)

None of these backgrounds are theme-aware, so in Classic mode the parchment MeshGradient is painted but immediately covered by black.

## Solution

Make the page and hero backgrounds transparent/parchment in Classic theme so the fixed MeshGradient shows through, while keeping the Disruptive theme unchanged.

### File Changes

#### 1. `src/pages/Index.tsx`
- Change the outer `div` background from the hardcoded dark color to a theme-aware value:
  - **Classic**: `transparent` (let the MeshGradient show through)
  - **Disruptive**: keep `hsl(0 0% 4%)`
- Change the lower sections wrapper background:
  - **Classic**: use a semi-transparent parchment overlay (e.g. `hsl(38 33% 93% / 0.7)`) so the gradient subtly shows through
  - **Disruptive**: keep `hsl(0 0% 0% / 0.6)`
- Import and use the `useTheme` hook

#### 2. `src/components/ui/animated-shader-hero.tsx`
- In **Classic** mode, hide the WebGL shader canvas and dark overlays since the hero doesn't need a dark shader background
- Change the outer container from `bg-black` to transparent in Classic mode
- Adjust text colors in Classic mode to work on parchment (dark ink instead of white)
- The word animations and manifesto styling remain the same, just with Classic-appropriate colors

## Technical Details

```text
Rendering stack (Classic theme, after fix):

  [z-index: 0]  ClassicMeshBackground (fixed, MeshGradient) -- VISIBLE
  [z-index: 0]  Index page wrapper (transparent bg)
    Hero component (transparent bg, no shader canvas)
      Title + Manifesto (dark ink text with word animations)
    Lower sections (semi-transparent parchment overlay)
      ThreePointsSection, Carousel, etc.
```

The key principle: in Classic mode, every layer must be transparent or semi-transparent so the fixed MeshGradient behind them remains visible. The Disruptive theme is untouched.

