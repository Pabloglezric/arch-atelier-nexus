

# Plan: Auth Page Marketing + Theme Visibility Fixes

## Issues Identified

1. **Auth page is hardcoded dark theme** — uses `bg-black` and gold/amber colors regardless of classic vs disruptive theme. In Classic mode the page looks out of place.
2. **Auth page lacks marketing** — it's a plain "Welcome / Sign in or create an account" with no value proposition for signing up.
3. **Navigation Sign In button** uses gold color in both themes — should adapt to classic theme colors.

## Changes

### 1. Redesign Auth page with marketing benefits section (`src/pages/Auth.tsx`)
- Add a two-column layout (on desktop): left side = marketing/benefits, right side = auth form
- Marketing section highlights what users get by signing up:
  - Access to Revit families and templates
  - Interactive 3D parametric models (Disruptive mode)
  - Newsletter with architectural news and updates
  - Growing library of resources
- Theme-aware styling: detect `isClassic` and use appropriate background/text colors
- On mobile: benefits shown above the form

### 2. Theme-aware AuthForm (`src/components/auth/AuthForm.tsx`)
- Adapt input, button, and tab colors for classic vs disruptive theme using `useTheme` hook
- Classic: warm earth tones on light background
- Disruptive: current dark + gold styling

### 3. Theme-aware Navigation auth elements (`src/components/Navigation.tsx`)
- Sign In button color should adapt to classic theme (dark text instead of gold)
- UserMenu trigger should also adapt

### 4. Theme-aware Account page (`src/pages/Account.tsx`)
- Same treatment: adapt background and text colors for classic mode

### Files to modify:
| File | Change |
|------|--------|
| `src/pages/Auth.tsx` | Two-column layout with marketing benefits, theme-aware |
| `src/components/auth/AuthForm.tsx` | Theme-aware colors |
| `src/components/Navigation.tsx` | Theme-aware Sign In button |
| `src/pages/Account.tsx` | Theme-aware styling |

