

# Inspiration Page

## Overview
A new "Inspiration" page with a Pinterest-style masonry grid, category filters, a localStorage-based voting system, and a submission form that emails references to admin@archevolution.world.

## Navigation Update
- Add "Inspiration" link between "Interactive Models" and "About" in `src/components/Navigation.tsx`
- Add route `/inspiration` in `src/App.tsx`

## New Page: `src/pages/Inspiration.tsx`
Matches the existing dark aesthetic (black background with dithered gold orb canvas animation, same fonts and styling patterns as Portfolio/Contact pages).

### Sections

**1. Page Header**
- Headline: "Inspiration" (gold, Playfair Display)
- Subheadline as specified (grey body text)

**2. Category Filter Bar**
- Pill-style buttons matching Portfolio filter bar
- Categories: All, Architecture, BIM & Digital, Parametric, Materials, Urbanism, AI & Tech, Renders
- "Sort by: Most Loved" toggle button next to filters

**3. Masonry Image Grid**
- CSS columns-based masonry layout: 3 columns desktop, 2 tablet, 1 mobile
- 6 placeholder cards using picsum.photos at varied aspect ratios
- Each card: full-bleed image with hover overlay showing category tag (gold pill), title (white), and heart button with counter
- Heart toggles gold on click; vote count stored in localStorage per image ID
- Most-voted images get a subtle gold border glow
- Framer Motion fade-in animations

**4. Submit an Inspiration (bottom section)**
- Dark card with gold border
- Headline + body text as specified
- Form: URL field + optional Note field + Submit button
- Submits via the existing `send-contact-email` edge function with subject "Inspiration Submission"

## Technical Details

### Files to create
- `src/pages/Inspiration.tsx` -- full page component

### Files to modify
- `src/App.tsx` -- add `/inspiration` route
- `src/components/Navigation.tsx` -- add "Inspiration" nav item between "Interactive Models" and "About"

### Voting Implementation
- localStorage key: `inspiration-votes` storing `Record<string, number>` for vote counts
- localStorage key: `inspiration-liked` storing `string[]` of liked image IDs
- Toggle behavior: click heart to like (increment +1, turn gold), click again to unlike (decrement -1, revert)
- "Sort by: Most Loved" re-orders grid descending by vote count

### Masonry Layout
Using CSS `columns` property for a true Pinterest-style variable-height grid without additional dependencies:
```text
columns-1 md:columns-2 lg:columns-3
```
Each card uses `break-inside: avoid` to prevent splitting across columns.

### Form Submission
Reuses the existing `send-contact-email` edge function with subject set to "Inspiration Submission" and the URL + note as the message body. Same validation patterns as the Contact page.

