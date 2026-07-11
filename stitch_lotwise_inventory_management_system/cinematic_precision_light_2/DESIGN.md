---
name: Cinematic Precision Light
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3f4852'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#6f7883'
  outline-variant: '#bec7d4'
  surface-tint: '#00629d'
  primary: '#00629d'
  on-primary: '#ffffff'
  primary-container: '#00a3ff'
  on-primary-container: '#00375a'
  inverse-primary: '#98cbff'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e5e2e1'
  on-secondary-container: '#656464'
  tertiary: '#904d00'
  on-tertiary: '#ffffff'
  tertiary-container: '#eb8104'
  on-tertiary-container: '#522900'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cfe5ff'
  primary-fixed-dim: '#98cbff'
  on-primary-fixed: '#001d33'
  on-primary-fixed-variant: '#004a77'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474646'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#ffb77d'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6e3900'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Archivo Narrow
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  display-sm:
    fontFamily: Archivo Narrow
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Archivo Narrow
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Archivo Narrow
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Archivo Narrow
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
    letterSpacing: '0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style

This design system is engineered for Lotwise to evoke a sense of high-performance energy and premium technical precision. The aesthetic is "Cinematic Precision Light"—a blend of high-end editorial layouts and advanced technical interfaces. It targets professionals who require speed and clarity without sacrificing a sophisticated, modern feel.

The style leverages **Modern Minimalism** mixed with **Glassmorphism** and **Tactile** depth. Large white spaces provide breathing room, while vibrant accents and deep shadows create a multi-layered, interactive experience that feels responsive and alive.

## Colors

The palette is built on high-contrast foundations to ensure maximum legibility and impact.

- **Primary (#00A3FF):** An electric blue used for core actions, progress indicators, and focal points. It represents energy and connectivity.
- **Secondary/Text (#121212):** A deep charcoal that provides a more cinematic, softer alternative to pure black while maintaining extreme contrast against the background.
- **Background (#FAFAFA):** A pristine, neutral off-white that prevents screen glare and serves as a canvas for soft shadows.
- **Subtle Accents:** Use 5% and 10% opacities of the Primary Blue for hover states and subtle highlights.

## Typography

The typographic hierarchy relies on a "technical-editorial" contrast. **Archivo Narrow** is the engine of the identity—bold, condensed, and efficient. It should be used for all headers with tight tracking to create a "locked-in" appearance.

**Inter** provides a functional, neutral counterpoint for body text and data entry. Use `label-md` for small headers or meta-information, often paired with all-caps to maintain the technical vibe.

## Layout & Spacing

This design system uses a **Fluid Grid** model with high-density spacing.

- **Desktop:** 12-column grid, 1280px max-width, 24px gutters.
- **Tablet:** 8-column grid, 16px gutters, 32px side margins.
- **Mobile:** 4-column grid, 16px gutters, 16px side margins.

Vertical rhythm is strictly maintained using multiples of 8px. Use `lg` and `xl` spacing for section transitions to maintain the premium, spacious feel.

## Elevation & Depth

Hierarchy is defined through **Ambient Shadows** and **Subtle Tonal Gradients**.

- **Level 1 (Base):** Flat, #FAFAFA surface.
- **Level 2 (Cards):** 1px border (#E2E8F0) and a very subtle shadow: `0 4px 6px -1px rgba(0, 0, 0, 0.05)`.
- **Level 3 (Floating/Modals):** Large, soft shadows to create a cinematic "lift": `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`.
- **Depth Effect:** Interactive elements use a subtle linear gradient from the Primary color to a slightly darker shade (10% tint) to simulate a physical, tactile surface.

## Shapes

The shape language is "Generous & Friendly." While the typography is sharp and technical, the containers are soft.

- **Standard Containers:** 16px (`rounded-lg`) is the baseline for cards and sections.
- **Interactive Elements:** Buttons and tags must be **Pill-shaped** (999px) to contrast against the rigid grid and technical fonts.
- **Inputs:** 12px roundedness to maintain a consistent language between cards and smaller elements.

## Components

- **Buttons:** All primary buttons are pill-shaped, using the electric blue gradient. Use `label-md` for button text.
- **Input Fields:** Large 56px height, 12px corner radius, and 1px light gray border. On focus, the border transitions to Primary blue with a 4px soft outer glow.
- **Cards:** White background with 16px corner radius and Level 2 elevation. 24px internal padding.
- **Chips/Status:** Small pill shapes with 10% opacity backgrounds of their respective status colors (e.g., Blue for Info, Green for Success).
- **Data Tables:** Clean lines, no vertical borders. Use Archivo Narrow for column headers to maintain the high-performance aesthetic.
- **Progress Bars:** Thin, high-contrast primary blue lines against a light gray track.