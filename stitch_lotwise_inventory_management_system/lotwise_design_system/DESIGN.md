---
name: Lotwise Design System
colors:
  surface: '#141313'
  surface-dim: '#141313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353435'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c5c6ca'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8f9194'
  outline-variant: '#44474a'
  surface-tint: '#c6c6c9'
  primary: '#c6c6c9'
  on-primary: '#2f3133'
  primary-container: '#1a1c1e'
  on-primary-container: '#838486'
  inverse-primary: '#5d5e61'
  secondary: '#c3c7cc'
  on-secondary: '#2d3135'
  secondary-container: '#484c50'
  on-secondary-container: '#b9bcc1'
  tertiary: '#cfc5be'
  on-tertiary: '#352f2b'
  tertiary-container: '#201b17'
  on-tertiary-container: '#8b837d'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e5'
  primary-fixed-dim: '#c6c6c9'
  on-primary-fixed: '#1a1c1e'
  on-primary-fixed-variant: '#454749'
  secondary-fixed: '#e0e3e8'
  secondary-fixed-dim: '#c3c7cc'
  on-secondary-fixed: '#181c20'
  on-secondary-fixed-variant: '#43474b'
  tertiary-fixed: '#ebe0da'
  tertiary-fixed-dim: '#cfc5be'
  on-tertiary-fixed: '#201b17'
  on-tertiary-fixed-variant: '#4c4641'
  background: '#141313'
  on-background: '#e5e2e1'
  surface-variant: '#353435'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-margin: 24px
  gutter: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The brand personality is high-performance, precise, and authoritative. It bridges the gap between a high-end automotive showroom and a cutting-edge developer environment. The target audience includes dealership owners and inventory managers who require a tool that feels as reliable as the vehicles they manage, yet as modern as a high-growth tech platform.

The design style is **Corporate / Modern** with a **Minimalist** foundation. It prioritizes clarity, data density without clutter, and a premium "dark-mode-first" aesthetic (though adaptable to light). Visual interest is driven by sharp typography, intentional use of "Electric Blue" for interactivity, and a subtle sense of depth inspired by modern SaaS dashboards like Vercel.

## Colors
The palette is rooted in "Deep Charcoal" and "Slate" to provide a sophisticated, low-fatigue environment for long-term data management. 

- **Primary & Secondary:** Use these for the core UI shell and container backgrounds.
- **Electric Blue:** Reserved strictly for primary actions, active navigation states, and critical progress indicators.
- **Functional Colors:** Emerald and Rose are used for status indicators (e.g., "In Stock," "Sold," "Overdue") and should be utilized with high-contrast text to ensure accessibility.
- **Surface Tiers:** Use `surface-main` for the application background and `surface-container` for cards and content blocks.

## Typography
The system utilizes **Inter** for all primary communication due to its exceptional legibility in data-heavy environments. **JetBrains Mono** is introduced as a secondary label font for VIN numbers, stock IDs, and technical metadata to evoke the "developer dashboard" aesthetic and ensure character-level clarity.

- **Headlines:** Use tight letter-spacing (-0.02em) for larger sizes to maintain a compact, premium look.
- **Body:** Standardize on 14px (`body-md`) for most dashboard content to maximize information density.
- **Labels:** Use `label-mono` in uppercase for secondary meta-information.

## Layout & Spacing
The layout follows a **Fluid Grid** model for the dashboard content, anchored by a 12-column system on desktop. 

- **Rhythm:** All spacing is derived from a 4px base unit. 
- **Margins:** Desktop views utilize a generous 24px outer margin.
- **Density:** Inventory tables and grids should use the `gutter` of 16px to maintain airiness while allowing for high vehicle counts on screen.
- **Adaptation:** On mobile, columns collapse to a single stack, and horizontal padding reduces to 16px.

## Elevation & Depth
Depth is created through **Tonal Layers** supplemented by **Ambient Shadows**. This design system avoids heavy shadows, instead using them to subtly lift interactive elements from the background.

- **Level 0 (Surface):** The lowest layer (`surface-main`).
- **Level 1 (Card):** Standard cards using `surface-container` with a 1px border (`border-subtle`).
- **Level 2 (Overlay):** Modals and dropdowns. These use `surface-elevated` and a soft, 12% opacity black shadow with a 16px blur to indicate focus and separation.
- **Interactive State:** Elements like buttons or active cards may use a thin 1px outline of "Electric Blue" to signify focus without increasing physical elevation.

## Shapes
The system uses a **Rounded** (8px) corner radius as its primary shape language. This softens the "technical" feel of the dark UI, making the application feel approachable and modern.

- **Base Radius:** 8px (`0.5rem`) for all standard components like buttons, inputs, and small cards.
- **Large Radius:** 16px (`1rem`) for large container modules and hero sections.
- **Interactive Elements:** Checkboxes maintain a slightly tighter 4px radius to feel precise.

## Components
- **Buttons:** Primary buttons are solid `accent_color` (Electric Blue) with white text. Secondary buttons use a `surface-elevated` background with a subtle border.
- **Inputs:** Fields are dark-themed with `surface-container` backgrounds and `border-subtle`. On focus, the border transitions to `accent_color`.
- **Chips/Badges:** Small, low-contrast pills used for vehicle status (e.g., "SUV," "Sedan"). Use `label-mono` for chip text.
- **Inventory Cards:** These are the core atoms of the system. They must feature a high-quality image, clear title (`headline-md`), and a metadata row using `label-mono`. 
- **Data Tables:** Use horizontal dividers only; avoid vertical lines to maintain the Vercel-like cleanliness. Use `text-muted` for headers and `text-primary` for cell data.
- **Status Indicators:** Small dots or subtle background tints using Success/Error colors to provide at-a-glance health of the inventory.