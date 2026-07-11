---
name: Apex Velocity
colors:
  surface: '#001037'
  surface-dim: '#001037'
  surface-bright: '#22376a'
  surface-container-lowest: '#000c2d'
  surface-container-low: '#001848'
  surface-container: '#021c4f'
  surface-container-high: '#10275a'
  surface-container-highest: '#1d3265'
  on-surface: '#dae2ff'
  on-surface-variant: '#c4c6d3'
  inverse-surface: '#dae2ff'
  inverse-on-surface: '#182e60'
  outline: '#8e909d'
  outline-variant: '#444652'
  surface-tint: '#b5c4ff'
  primary: '#b5c4ff'
  on-primary: '#00297a'
  primary-container: '#002b80'
  on-primary-container: '#7c97f0'
  inverse-primary: '#3d59ae'
  secondary: '#ffffff'
  on-secondary: '#283500'
  secondary-container: '#c3f400'
  on-secondary-container: '#556d00'
  tertiary: '#c6c6c7'
  on-tertiary: '#2f3131'
  tertiary-container: '#313333'
  on-tertiary-container: '#9a9b9b'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b5c4ff'
  on-primary-fixed: '#00174d'
  on-primary-fixed-variant: '#214195'
  secondary-fixed: '#c3f400'
  secondary-fixed-dim: '#abd600'
  on-secondary-fixed: '#161e00'
  on-secondary-fixed-variant: '#3c4d00'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#001037'
  on-background: '#dae2ff'
  surface-variant: '#1d3265'
typography:
  display-lg:
    fontFamily: Archivo Narrow
    fontSize: 72px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: Archivo Narrow
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Archivo Narrow
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Archivo Narrow
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: 0em
  body-lg:
    fontFamily: Archivo Narrow
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: 0em
  body-md:
    fontFamily: Archivo Narrow
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  label-caps:
    fontFamily: Archivo Narrow
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
  stats-xl:
    fontFamily: Archivo Narrow
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 40px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 20px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style

This design system is engineered for the high-octane world of professional motorsport. It balances the raw intensity of racing livery with the technical precision of a high-performance telemetry dashboard. The visual language is defined by a "Digital HUD" aesthetic—utilitarian, urgent, and premium.

The style is a fusion of **High-Contrast Bold** and **Modern Glassmorphism**. It utilizes deep, saturated voids of color contrasted against ultra-bright neon accents to evoke speed and energy. Every interface element should feel like a piece of high-end engineering: lightweight, durable, and purpose-built for split-second decision-making. The target audience includes racing enthusiasts, engineers, and luxury automotive clients who demand clarity under pressure.

## Colors

The palette is anchored by **Deep Cobalt (#002B80)**, providing a stable, immersive foundation that mimics professional racing kits and nighttime track conditions. 

- **Primary Background:** Use the deep cobalt for the base canvas.
- **Electric Lime (#CCFF00):** Reserved strictly for high-priority calls to action, active states, and critical data points. It should "cut" through the blue background.
- **High-Contrast Surfaces:** Use pure white or near-white for content cards to ensure maximum legibility of complex data.
- **Glass Accents:** Use semi-transparent layers of the neutral navy to create depth without losing the vibrant blue undertones.

## Typography

**Archivo Narrow** is used exclusively to maintain a technical, condensed HUD feel. Its verticality allows for dense information displays without sacrificing readability.

- **Headlines:** Use Bold and Extra Bold weights. For hero sections, apply a slight italic lean to imply forward motion and speed.
- **Data Display:** Numerical data should use the `stats-xl` style, often paired with the Electric Lime color for emphasis.
- **Labels:** Small caps with increased letter spacing should be used for secondary metadata and technical categories to mimic aerospace instrumentation.

## Layout & Spacing

The layout follows a **Rigid Technical Grid**. Spacing is based on a 4px baseline to ensure mathematical precision in alignment.

- **Desktop:** A 12-column fluid grid with 20px gutters. Content is often organized into "Modules" that resemble instrument clusters.
- **Mobile:** A 4-column grid with 16px margins. 
- **Rhythm:** Use tighter spacing (`xs`, `sm`) within data cards to keep related metrics grouped, and larger spacing (`lg`, `xl`) between major section blocks to maintain a premium, airy feel despite the high-density information.

## Elevation & Depth

This design system uses a combination of **High-Contrast Layering** and **Subtle Glassmorphism** to create a multi-dimensional workspace.

1.  **Base Level (Level 0):** Deep Cobalt background.
2.  **Glass Inlays (Level 1):** Semi-transparent navy layers (20% opacity) with a 12px backdrop blur. Used for sidebar navigation and secondary toolbars.
3.  **Data Cards (Level 2):** Solid White or Light Gray (#F5F5F5). These "pop" aggressively against the dark background.
4.  **Shadows:** Use heavy, multi-layered "ambient" shadows on cards. The shadow color should be a darker version of the cobalt (#000D26) at 40% opacity to ensure the cards feel grounded in the environment rather than floating.
5.  **Accent Glow:** Active components (like the primary button) should emit a subtle Electric Lime outer glow (blur: 15px, opacity: 0.3) to simulate a powered-on LED state.

## Shapes

The shape language is **Soft-Industrial**. We avoid perfectly round or pill shapes in favor of clipped corners or very subtle radii that feel like machined components.

- **Standard Elements:** Buttons and input fields use a 0.25rem radius.
- **Containers:** Large data cards and content blocks use a 0.5rem radius. 
- **Interactive Accents:** Use 45-degree chamfered (clipped) corners for specific "Action" buttons to reinforce the racing/mechanical aesthetic.

## Components

- **Buttons:** Primary buttons are Electric Lime with black text. Secondary buttons are outlined in white or semi-transparent glass. Use all-caps for button labels.
- **Data Chips:** Small, rectangular indicators with a background of the primary blue and an Electric Lime left-border for active status.
- **Lists:** Use "Zebra" striping with low-opacity navy overlays. List items should have high-contrast white text for primary data and muted light-blue for secondary data.
- **Input Fields:** Dark background with a thin 1px white border. On focus, the border transitions to Electric Lime with a subtle outer glow.
- **Cards:** The signature component. High-contrast white background, sharp internal padding (24px), and bold headings. Cards often feature a "header bar" in a contrasting color (Cobalt) to house icons and titles.
- **Progress Bars:** Use thick, segmented bars (like a tachometer) rather than smooth continuous lines. Segments should light up in Electric Lime as they fill.