

# Fix: Make ClassicMeshBackground Visible Across All Pages

## Problem

The `ClassicMeshBackground` component renders as a **fixed** full-screen element (z-index 5), but it is invisible on most pages because they use **opaque dark backgrounds** that completely cover it:

| Page | Background | Classic-aware? |
|------|-----------|----------------|
| Index | `transparent` (Classic) / `hsl(0 0% 4%)` (Disruptive) | Yes |
| InteractiveModels | `#f5f0e8` (Classic) / `hsl(0 0% 4%)` (Disruptive) | Yes |
| **Portfolio** | `hsl(0 0% 4%)` always | **No -- blocks MeshGradient** |
| **About** | `hsl(0 0% 4%)` always | **No -- blocks MeshGradient** |
| **Contact** | `hsl(0 0% 4%)` always | **No -- blocks MeshGradient** |
| **Inspiration** | `bg-black` always | **No -- blocks MeshGradient** |

Each of these pages also has its own canvas-based animated background (pixelated orbs / dithered gradients) that only makes sense for the Disruptive theme.

## Solution

For each affected page, make the wrapper background and the canvas animation **theme-aware**:
- In **Classic mode**: set the wrapper to `transparent` and hide the dark canvas animation, so the global `ClassicMeshBackground` shows through
- In **Disruptive mode**: keep everything exactly as it is today
- Adjust text colors on each page where needed so they remain readable against the parchment background in Classic mode

## File Changes

### 1. `src/pages/Portfolio.tsx`
- Import `useTheme` hook
- Change wrapper `backgroundColor` to `transparent` when Classic, keep `hsl(0 0% 4%)` when Disruptive
- Conditionally hide the dark canvas animation in Classic mode
- Adjust heading/text colors in Classic mode (dark ink instead of gold/grey)

### 2. `src/pages/About.tsx`
- Import `useTheme` hook
- Change wrapper `backgroundColor` to `transparent` when Classic
- Hide dark canvas animation in Classic mode
- Adjust text colors for Classic readability

### 3. `src/pages/Contact.tsx`
- Import `useTheme` hook
- Change wrapper `backgroundColor` to `transparent` when Classic
- Hide dark canvas animation in Classic mode
- Adjust text colors for Classic readability

### 4. `src/pages/Inspiration.tsx`
- Import `useTheme` hook
- Change wrapper from `bg-black` to transparent when Classic
- Hide dark canvas animation in Classic mode
- Adjust text colors for Classic readability

### 5. `src/components/ui/classic-mesh-background.tsx`
- Increase opacity from 0.55 to 0.75 so the gradient is more clearly visible
- This ensures the background is unmistakably present across all pages

## Technical Notes

```text
Rendering stack in Classic mode (all pages, after fix):

  [fixed, z-5]  ClassicMeshBackground (MeshGradient) -- VISIBLE
  [page layer]  Page wrapper (transparent background)
    [hidden]    Dark canvas animation -- NOT RENDERED
    [z-1]       Page content (dark ink text on parchment)
```

The Disruptive theme remains completely untouched -- all changes are gated behind `isClassic` checks.
