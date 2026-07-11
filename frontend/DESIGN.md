# LotWise Design System

## 1. Palette: "Midnight Showroom"
- **Background (Deep Charcoal):** `#0F1115` (Tailwind `slate-950`) — Feels like a dark, polished showroom floor. Much richer than flat black or generic SaaS dark-blue.
- **Surface (Metallic Gray):** `#1E222A` (Tailwind `slate-900`) — Used for cards and elevated surfaces.
- **Accents (Racing Red):** `#E11D48` (Tailwind `rose-600`) — One confident, aggressive accent color used sparingly for primary actions (like "Purchase") and critical states. It evokes automotive taillights and high-performance brake calipers.
- **Chrome/Silver Text:** `#F1F5F9` (Tailwind `slate-100`) for primary text, `#94A3B8` (Tailwind `slate-400`) for secondary text, mimicking brushed metal.
- **Success/Available:** `#10B981` (Tailwind `emerald-500`) — Standard, clear success indicator.

*Justification:* This palette avoids the generic "blue SaaS" look by combining a moody, deep charcoal showroom floor with a high-performance "Racing Red" accent, feeling distinctly automotive, premium, and trustworthy.

## 2. Typography
- **Display/Headings:** `Space Grotesk` — Engineered, wide, and slightly technical. Perfect for vehicle makes/models and large numbers (prices/stats).
- **Body:** `Inter` — Highly legible, neutral, and precise for dense technical data (VINs, categories, specs).
- **Type Scale:** 
  - `text-xs` (12px) tracking-wide uppercase for labels/status
  - `text-sm` (14px) for secondary info
  - `text-base` (16px) for standard body
  - `text-xl` to `text-4xl` for vehicle headings and prices.

*Justification:* The combination of a highly technical display font with a hyper-readable body font mimics the dashboard cluster of a modern luxury sports car.

## 3. Layout & Spacing
- **Spacing Scale:** Strict adherence to Tailwind's 4/8/16/24/32/48px scale. 
- **Card Grid:** Vehicle listings use a consistent grid (`gap-6` or `gap-8`) with standardized card heights so images and actions align perfectly across rows.
- **Forms:** Stacked labels with consistent 16px vertical rhythm, inputs with subtle focus rings (no harsh outlines).

*Justification:* A rigid, predictable grid reflects the precision engineering of the vehicles being sold.

## 4. Signature Element: The "Telemetry Badge"
- Every vehicle card features a distinct "Status Badge" positioned absolutely over the vehicle image (top-left). 
- When in stock, it's a sleek, frosted-glass badge (backdrop-blur) with a subtle emerald dot.
- When out of stock, it's a desaturated, brushed-metal look, and the entire vehicle image is slightly dimmed.
- The "Purchase" button physically retracts (scales down slightly) and changes to a flat, unclickable metallic gray when out of stock, communicating "Sold Out" visually before the user even reads the text.

*Justification:* This immediately communicates availability in a highly visual, tactile way that feels like looking at physical inventory tags on a lot.
