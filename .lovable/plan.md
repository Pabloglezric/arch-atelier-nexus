

## Fix: Overlapping Sections and Broken Carousel Layout

### Problems Identified

1. **Sections overlap the Hero**: The fixed hero (`fixed inset-0`) needs a spacer div so content scrolls past it before reaching the sections. The previous spacer was removed during the carousel addition, causing ThreePointsSection to render right at the top and overlap the hero text.

2. **Carousel slides stack vertically**: The `<li>` slide items are in normal document flow inside the `<ul>`, so all 7 slides render one below another, creating a massive vertical stack. The Aceternity carousel expects slides to be absolutely positioned on top of each other, with only the current slide prominent.

### Changes

#### 1. Fix `src/pages/Index.tsx` -- Add Hero Spacer Back
- Add a `<div className="h-screen" />` spacer before the content sections, inside the `relative z-10` wrapper
- This transparent spacer lets the user scroll past the fixed hero before the opaque content sections begin
- The existing `backgroundColor: 'hsl(0 0% 0% / 0.6)'` wrapper stays as-is for the content below

#### 2. Fix `src/components/ui/carousel.tsx` -- Absolute Position Slides
- Change each `<li>` slide to use `absolute inset-0` positioning so all slides stack on top of each other in the same space
- Only the current (active) slide is fully visible; inactive slides scale down with `rotateX(8deg)` and lower opacity
- Add `list-style-none` to the `<ul>` to remove bullet styling
- The container keeps its `w-[70vmin] h-[70vmin]` sizing with `perspective: 1200px`

### Technical Details

**Index.tsx** -- insert before the content `<div>`:
```tsx
{/* Spacer to scroll past the fixed hero */}
<div className="h-screen" />
```

**carousel.tsx** -- change slide `<li>` class from flow layout to absolute stacking:
```tsx
// Before (broken - normal flow, stacks vertically):
className="flex flex-1 flex-col items-center justify-center relative text-center ... w-[70vmin] h-[70vmin] mx-[4vmin] z-10"

// After (fixed - slides stack on top of each other):
className="absolute inset-0 flex flex-col items-center justify-center text-center opacity-100 transition-all duration-300 ease-in-out z-10 cursor-pointer"
```

Also adjust the inactive slide z-index so the active slide is always on top, and ensure the `<ul>` has `list-style: none`.

