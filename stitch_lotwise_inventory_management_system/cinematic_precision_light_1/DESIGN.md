---
name: Cinematic Precision Light
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#3f4852'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#6f7883'
  outline-variant: '#bec7d4'
  surface-tint: '#00629d'
  primary: '#00629d'
  on-primary: '#ffffff'
  primary-container: '#00a3ff'
  on-primary-container: '#00375a'
  inverse-primary: '#98cbff'
  secondary: '#5e5e63'
  on-secondary: '#ffffff'
  secondary-container: '#e0dfe5'
  on-secondary-container: '#626267'
  tertiary: '#505f76'
  on-tertiary: '#ffffff'
  tertiary-container: '#8e9eb6'
  on-tertiary-container: '#253549'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cfe5ff'
  primary-fixed-dim: '#98cbff'
  on-primary-fixed: '#001d33'
  on-primary-fixed-variant: '#004a77'
  secondary-fixed: '#e3e2e7'
  secondary-fixed-dim: '#c7c6cb'
  on-secondary-fixed: '#1a1b20'
  on-secondary-fixed-variant: '#46464b'
  tertiary-fixed: '#d3e4fe'
  tertiary-fixed-dim: '#b7c8e1'
  on-tertiary-fixed: '#0b1c30'
  on-tertiary-fixed-variant: '#38485d'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-lg:
    fontFamily: Archivo Narrow
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Archivo Narrow
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Archivo Narrow
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Archivo Narrow
    fontSize: 24px
    fontWeight: '600'
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
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.08em
  data-tabular:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style

This design system translates a high-performance automotive aesthetic into a clean, light-mode environment. The brand personality is technical, precise, and premium, evoking the feel of a high-end engineering workshop or a contemporary digital cockpit. 

The design style is a hybrid of **Minimalism** and **Modern Corporate**, utilizing heavy whitespace to emphasize content while maintaining a disciplined, structured feel. We move away from the heavy shadows of traditional UI towards a "Technical Flat" look—where hierarchy is defined by razor-sharp lines, subtle tonal shifts, and purposeful use of an electric accent color. The emotional response should be one of absolute clarity, reliability, and high-velocity efficiency.

## Colors

The palette is anchored by a high-contrast foundation. The primary background is a crisp white (#FFFFFF) to maximize legibility and "air." Secondary surfaces and containers use a very light cool grey (#F8F9FA) to provide subtle structural separation without adding visual weight.

The primary accent is Electric Blue (#00A3FF), used sparingly for interactive elements, status indicators, and critical data points. All primary text and iconography utilize a deep obsidian (#121317) to ensure maximum contrast and a sophisticated, "ink-on-paper" technical feel. Borders are kept thin and light (#E2E8F0) to maintain the precision-engineered aesthetic.

## Typography

Typography is the core of the technical aesthetic. **Archivo Narrow** is used for headlines to provide a condensed, high-performance look reminiscent of instrumentation and telemetry. **Inter** provides a neutral, highly readable base for body copy and long-form content. 

To reinforce the developer/engineering feel, **JetBrains Mono** is utilized for labels, metadata, and tabular data. This monospaced font ensures that numerical values align perfectly in data-heavy views. Use "label-caps" for all eyebrow headlines and small UI descriptors to create a clear visual hierarchy through casing and tracking rather than just weight.

## Layout & Spacing

The layout follows a strict 4px baseline grid. On desktop, a 12-column fluid grid is preferred with generous 64px outer margins to create a "gallery" feel for the content. Gutters are fixed at 24px to ensure breathing room between data components.

On mobile, the system transitions to a 4-column grid with 16px margins. Components should be designed to span full width or 2-columns on mobile. Spacing between major sections should be aggressive (48px+) to maintain the minimalist, airy aesthetic, while internal component spacing should be tight and efficient (8px - 16px).

## Elevation & Depth

In this light-themed iteration, depth is achieved through **tonal layering** and **soft ambient shadows** rather than heavy blurs. 

1.  **Level 0 (Base):** Pure white (#FFFFFF). 
2.  **Level 1 (Sub-surface):** Used for sidebars or background grouping, utilizing the light grey (#F8F9FA).
3.  **Level 2 (Cards/Floating Elements):** These use a white fill with a 1px border (#E2E8F0) and an extremely subtle shadow (Y: 2px, Blur: 4px, Color: rgba(18, 19, 23, 0.05)).
4.  **Level 3 (Modals/Overlays):** Stronger separation with a 1px border and a medium shadow (Y: 8px, Blur: 16px, Color: rgba(18, 19, 23, 0.08)).

Avoid using shadows for decorative purposes; they must only indicate interactable elements or temporary overlays.

## Shapes

The shape language is "Soft-Technical." Elements use a subtle **0.25rem (4px)** corner radius to maintain a professional, sharp edge without feeling aggressive. This "Soft" (Level 1) approach ensures the UI feels modern while staying true to the structured, grid-based layout. 

Larger containers (like primary cards) can scale to **0.5rem (8px)**, but never go beyond this to avoid the "bubbly" look common in consumer social apps. Interactive buttons should remain at the standard 4px radius for a precise, "machined" look.

## Components

### Buttons
Primary buttons use the Electric Blue (#00A3FF) background with white text. Secondary buttons use a white background with a 1px border (#E2E8F0) and Obsidian text. Interaction states should be subtle: a 10% black overlay on hover for primary, and a light grey background shift for secondary.

### Input Fields
Inputs should have a white background, a 1px border (#E2E8F0), and 12px horizontal padding. On focus, the border transitions to Electric Blue. Labels must always use the monospaced "label-caps" typography level, placed above the field.

### Chips & Tags
Used for status and filtering. They should be rectangular with a 2px radius and use a light grey fill (#F1F5F9). Text should be JetBrains Mono. Status-specific chips (Success, Warning) should use high-saturation colors but with very light, tinted backgrounds for better legibility.

### Cards
Cards are defined by their 1px #E2E8F0 border. Headers within cards should be separated by a thin horizontal rule. Use "data-tabular" for any numbers inside cards to ensure vertical alignment across rows.

### Lists
Lists use thin horizontal dividers. Hover states on list items should utilize a simple background color shift to #F8F9FA. Action icons in lists should be Obsidian with a 60% opacity, shifting to 100% on hover.