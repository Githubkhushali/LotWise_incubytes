---
name: Cinematic Precision
colors:
  surface: '#121317'
  surface-dim: '#121317'
  surface-bright: '#38393d'
  surface-container-lowest: '#0d0e12'
  surface-container-low: '#1a1b1f'
  surface-container: '#1e1f23'
  surface-container-high: '#292a2e'
  surface-container-highest: '#343539'
  on-surface: '#e3e2e7'
  on-surface-variant: '#bec7d4'
  inverse-surface: '#e3e2e7'
  inverse-on-surface: '#2f3034'
  outline: '#88919d'
  outline-variant: '#3f4852'
  surface-tint: '#98cbff'
  primary: '#98cbff'
  on-primary: '#003354'
  primary-container: '#00a3ff'
  on-primary-container: '#00375a'
  inverse-primary: '#00629d'
  secondary: '#c8c5cb'
  on-secondary: '#303034'
  secondary-container: '#47464b'
  on-secondary-container: '#b7b4ba'
  tertiary: '#c8c5cc'
  on-tertiary: '#303035'
  tertiary-container: '#9d9ba2'
  on-tertiary-container: '#333339'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#cfe5ff'
  primary-fixed-dim: '#98cbff'
  on-primary-fixed: '#001d33'
  on-primary-fixed-variant: '#004a77'
  secondary-fixed: '#e5e1e7'
  secondary-fixed-dim: '#c8c5cb'
  on-secondary-fixed: '#1b1b1f'
  on-secondary-fixed-variant: '#47464b'
  tertiary-fixed: '#e4e1e8'
  tertiary-fixed-dim: '#c8c5cc'
  on-tertiary-fixed: '#1b1b20'
  on-tertiary-fixed-variant: '#47464c'
  background: '#121317'
  on-background: '#e3e2e7'
  surface-variant: '#343539'
typography:
  display-lg:
    fontFamily: Archivo Narrow
    fontSize: 72px
    fontWeight: '700'
    lineHeight: 80px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Archivo Narrow
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: 0.02em
  headline-md:
    fontFamily: Archivo Narrow
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-sm:
    fontFamily: Archivo Narrow
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Archivo Narrow
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.1em
  data-mono:
    fontFamily: Archivo Narrow
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 24px
    letterSpacing: -0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  max-width: 1440px
---

## Brand & Style

The design system is engineered to evoke the atmosphere of a high-end automotive showroom at midnight—exclusive, technical, and impeccably polished. It balances the raw power of performance engineering with the refined restraint of luxury digital interfaces.

The aesthetic direction is a fusion of **Glassmorphism** and **High-Tech Minimalism**. Every interface element should feel like a precision instrument or a piece of architectural glass. The experience is cinematic, utilizing deep shadows and focused light to guide the user's eye toward the vehicles, mirroring the lighting of a Tesla or Porsche configurator.

Key brand attributes include:
*   **Precision:** Mathematical alignment and condensed data visualization.
*   **Aura:** Subtle glows and under-lighting that suggest power beneath the surface.
*   **Exclusivity:** A "Dark Mode" first approach that prioritizes content depth over surface noise.

## Colors

The palette is anchored by the infinite depth of the automotive night. 

*   **Primary (Electric Blue):** Used sparingly for high-impact actions, data highlights, and "power-on" states. It should feel like an LED light source.
*   **Base (Deep Charcoal):** A near-black (#050508) that provides the canvas for glass effects and highlights.
*   **Surface Layers:** Tints of charcoal (#1A1A1F) are used for card containers to provide separation without breaking the dark immersion.
*   **Accents:** Greys are kept cool-toned to maintain the clinical, high-tech feel.

## Typography

Typography is used to distinguish between *narrative* and *performance*. 

**Archivo Narrow** is the "HUD font." It is used for prices, specifications, and headings. Its condensed nature mimics digital instrument clusters and performance metrics. For mobile, display sizes scale down by 25% while maintaining the tight tracking.

**Inter** provides the functional balance. It is used for all body text and descriptions, emphasizing readability and a neutral, professional tone. Wide line-heights in body text contrast against the dense, technical look of the headings to create a luxurious sense of "space."

## Layout & Spacing

The layout follows a **12-column fixed grid** on desktop to maintain the feel of a structured brochure. 

*   **Desktop:** 1440px max width, 24px gutters. Elements should favor generous margins (64px+) to create a feeling of gallery-like exclusivity.
*   **Mobile:** 4-column fluid grid. Components stack vertically, but maintain horizontal padding of 20px.
*   **Rhythm:** An 8px linear scale is used. Components are often separated by larger "voids" (64px, 128px) to emphasize the vehicle photography as the centerpiece.

## Elevation & Depth

Depth is achieved through light and transparency rather than traditional physical stacking.

1.  **Backdrop Blur:** All overlays and cards use a `20px` to `40px` blur effect with a 10-15% white opacity tint.
2.  **Edge Treatment:** Cards are defined by a 1px "glass" border. This border is a linear gradient: top-left (white, 20% opacity) to bottom-right (white, 5% opacity).
3.  **Under-lighting:** Active cards and primary buttons utilize a soft "Electric Blue" glow (#00A3FF) at 20% opacity, positioned as a drop shadow with `0px 20px 40px` spread.
4.  **The Void:** Backgrounds remain pure #050508 to ensure the glass elements appear to float in a vacuum.

## Shapes

The shape language is "Soft-Technical." We avoid aggressive curves to maintain a sense of precision engineering. 

A base radius of **4px (0.25rem)** is used for small controls and inputs. Larger cards and containers use **8px (0.5rem)**. This provides just enough softness to feel premium without losing the sharp, architectural look of a high-tech dashboard. 

**Circular shapes** are reserved exclusively for status indicators or specific dial-based UI elements.

## Components

### Buttons
*   **Primary:** A subtle gradient of Electric Blue (#00A3FF to #007ACC). On hover, a "shine" effect (white gradient at 15% opacity) sweeps across the surface.
*   **Secondary:** Ghost style with a 1px glass border and blurred background.

### Cards
*   **Showroom Card:** Floating glass container with an inner 1px stroke. Images should have a slight zoom effect on hover. Specifications inside the card use the `data-mono` typography role.

### Inputs
*   **HUD Fields:** Dark backgrounds (#0A0A0C) with bottom-only 1px borders. Focus states activate a subtle Electric Blue glow on the border.

### Status Chips
*   **Performance Markers:** Small, uppercase labels with increased letter spacing. Used for "New Arrival," "Sold," or "Electric."

### Spec Lists
*   **Technical Grid:** Use 1px vertical separators between specs (like Torque, 0-60, Horsepower) to mimic a digital dashboard layout.