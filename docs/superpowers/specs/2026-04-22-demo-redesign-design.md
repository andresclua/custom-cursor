# Demo Page Redesign — Custom Cursor

**Date:** 2026-04-22  
**Status:** Approved

## Goal

Redesign the demo page (`src/index.html` + `src/scss/style.scss`) deployed to Netlify via `demo/` (built with `vite.config.demo.js`) to feel premium and editorial, using a Vodafone-inspired design system. The cursor library itself remains unchanged.

## Page Rhythm

```
1. DARK HERO
2. RED DIVIDER BAND
3. EXAMPLES SECTION (white canvas)
4. CHARCOAL FOOTER
```

---

## 1. Hero

- **Background:** `#25282b` (charcoal, no photo)
- **Headline:** `CUSTOM CURSOR` — Inter 800, ~96px desktop / 56px mobile, uppercase, letter-spacing: -1px
- **Subline:** "A lightweight JS library for customizable animated cursors" — 18px, weight 400, `#7e7e7e`
- **Install badge:** `npm install @andresclua/custom-cursor` — dark pill (`rgba(255,255,255,0.08)`), monospace font, click copies to clipboard, label briefly changes to "Copied!"
- **CTA button:** "VIEW ON NPM" — red pill (`#e60000`), white text, 60px border-radius, links to npm page

## 2. Red Divider Band

- Full-width `#e60000`, 56px height, no content

## 3. Examples Section

- **Background:** `#ffffff`
- **Max width:** 1200px, centered, 32px horizontal padding desktop / 16px mobile
- **Each example block:**
  - Title: 20px weight 700, `#25282b`
  - Description: 14px weight 400, `#7e7e7e`
  - Example number badge: red-outlined pill, uppercase, 12px weight 600
  - **Left column (50%):** preview area — background `#f2f2f2`, min-height 240px, flex centered, contains the interactive demo elements
  - **Right column (50%):** code panel — background `#1e1e1e`, tabs HTML / SCSS / JS, active tab underline `#e60000`, code in monospace `#d4d4d4`
  - Hairline separator `#e0e0e0` between examples

- **Examples included (in order):**
  0. Setup (Dot + Ring)
  1. Basic Focus (links & buttons)
  2. Custom Focus Class (grow)
  3. Focus with Callbacks (text)
  4. Disable / Enable
  5. Update Options
  6. Generic Focus Elements
  7. Dynamic Content (Load More)

## 4. Footer

- **Background:** `#25282b`
- **Content:** package name, version `v1.1.0`, npm link, GitHub link, "MIT License"
- **Type:** 14px weight 400 white, column header 16px weight 800 uppercase white
- **Padding:** 48px vertical

---

## Typography

- **Font:** Inter (Google Fonts), weights 400 / 600 / 800
- **Fallback:** `"Helvetica Neue", Arial, sans-serif`
- **Display headline:** 96px desktop → 56px mobile, weight 800, uppercase, letter-spacing -1px, line-height 0.9
- **Section titles:** 20px weight 700
- **Body / desc:** 14-18px weight 400
- **Buttons:** 14px weight 700, letter-spacing 0.14px

## Color Tokens

| Token | Value | Use |
|-------|-------|-----|
| Brand Red | `#e60000` | CTAs, divider band, active tab underline, badges |
| Charcoal | `#25282b` | Hero background, footer, headings on white |
| Canvas White | `#ffffff` | Examples section background |
| Light Neutral | `#f2f2f2` | Preview area background |
| Body Grey | `#7e7e7e` | Descriptions, meta text |
| Code Dark | `#1e1e1e` | Code panel background |
| Code Text | `#d4d4d4` | Code foreground |

## Cursor

The library's own cursor (dot + ring) stays active across the entire page. The cursor color accent updates to `#e60000` on hover to match the design system.

## Responsive

- Hero headline: 96px → 72px (tablet) → 48px (mobile)
- Two-column example layout: 50/50 → stacked (mobile ≤ 768px), preview on top, code below
- Red band: 56px → 40px (mobile)
- Section padding: 80px vertical desktop → 48px mobile

## Build

- Source: `src/index.html` + `src/scss/style.scss` + `src/js/index.js`
- Command: `vite build --config vite.config.demo.js`
- Output: `demo/` → served by Netlify
