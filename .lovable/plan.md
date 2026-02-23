

## Plan: Add Aceternity Carousel to Landing Page

### Overview
Replace the existing unused carousel component with the Aceternity UI carousel, add it to the landing page between the main content sections and the "Connect & Follow" section, and remove the background image. The carousel will display the same images used in the Inspiration gallery.

### Changes

#### 1. Install dependency
- Add `@tabler/icons-react` package

#### 2. Replace `src/components/ui/carousel.tsx`
- Overwrite the existing shadcn/Embla carousel (currently unused) with the Aceternity carousel component
- The component features 3D perspective transforms, mouse-tracking lighting effects, and slide navigation controls
- Since the JSX was stripped during pasting, I will reconstruct the full component from the Aceternity registry source (minified version visible in search results), including proper class names like `[perspective:1200px]`, `[transform-style:preserve-3d]`, `w-[70vmin] h-[70vmin]`, etc.

#### 3. Create `src/components/InspirationCarousel.tsx`
- New wrapper component that imports the Aceternity `Carousel` and feeds it the 7 inspiration images from `src/assets/insp-*.png`
- Each slide will have a descriptive title matching the Inspiration page items (e.g., "Waterfront Gallery Pavilion", "Shell Form Meditation Chapel")
- Button text will say "View Gallery" linking to the `/inspiration` page
- Works in both Classic and Disruptive themes

#### 4. Update `src/pages/Index.tsx`
- Remove the background image/canvas (the `h-[140vh]` spacer div that creates scroll space over the fixed hero)
- Add the `InspirationCarousel` section between the `ThreePointsSection`/`ArchEvolutionCTA` block and the `SocialLinks` ("Connect & Follow") section
- Move `SocialLinks` to appear after the carousel, at the very bottom
- The page flow will be: Hero -> Navigation -> ThreePointsSection -> ArchEvolutionCTA -> **InspirationCarousel** -> SocialLinks (Connect & Follow)

### Technical Details

- The Aceternity carousel uses CSS perspective transforms and `requestAnimationFrame` for smooth mouse-tracking lighting effects on slides
- Slides scale down with a `rotateX(8deg)` tilt when not active, and scale to full with `rotateX(0deg)` when selected
- Navigation uses prev/next arrow buttons with `IconArrowNarrowRight` from `@tabler/icons-react`
- The carousel container is `w-[70vmin] h-[70vmin]` making it responsive by viewport size
- No additional CSS file needed -- everything uses Tailwind utility classes
