# Custom Cursor Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single-page demo with a three-page site (landing with scroll chapters, API, Examples) where the cursor changes behavior per chapter and the background color scrubs with scroll.

**Architecture:** Vite multipage build (`--mode site`) outputs to `dist-site`; the library build (`npm run build`, `dist/`) is untouched except one small fade-in fix. One global `CustomCursor` instance per page (`src/js/site/cursor.js`); each landing chapter is a module that registers its zone behaviors via `update()` and GSAP callbacks. ScrollTrigger drives the background scrub and the "hide while scrolling" respiro.

**Tech Stack:** Vite 5, SCSS, GSAP + ScrollTrigger (site only, never in the library), vanilla JS.

**Spec:** `docs/superpowers/specs/2026-11-09-custom-cursor-showcase-design.md`

## Global Constraints

- No breaking changes to `new CustomCursor({...})`; library changes are optional and retrocompatible.
- The library keeps zero dependencies; `gsap` is a site dependency only.
- No Pagefold, no transitions between pages: plain links.
- Own visual identity, sharp/editorial, not the purple-blue ethereal gradient of PerlinDOM.
- BEM with `c--` prefix and Terra/Punky structure, like the rest of the repo. Site text in English.
- `prefers-reduced-motion`: cursor still follows the mouse (effective lerp 1, no trail), no hiding between chapters, no background scrub, no scroll effects.
- Touch: library does not initialize (`disableTouch`); site degrades to a reading page with the same chapters and no cursor.
- Text contrast WCAG AA on every background stop of the scrub.
- Keep domain `cursor.andresclua.com`; `npm run build`, `dist/`, `main`/`exports` unchanged. Remove committed `demo/` once Netlify builds the site.
- URLs: `/`, `/api.html`, `/examples.html`, active page marked in nav.
- Do not run `git add`/`git commit` (user rule): each task ends with "ready for the user to commit".

## Review Focus

- User scrolls with keyboard/trackpad without moving the mouse: cursor must reappear when scroll stops, never stay hidden.
- Mouse already over the page at load: cursor must not stay invisible until a second movement.
- `prefers-reduced-motion: reduce` on: no hiding, no scrub, no trail, cursor still works.
- Resize / fonts loading shifts chapter positions: ScrollTrigger `refresh` so backgrounds and states stay in sync.
- Touch device: no cursor markup flash, all chapter content readable and the chapter backgrounds still set (static).

---

### Task 1: Site scaffold and build

**Files:**
- Create: `vite.config.site.js`, `src/api.html`, `src/examples.html`
- Modify: `package.json` (scripts `build:site`, dependency `gsap`), `netlify.toml`, `src/index.html` (becomes a minimal shell), `.gitignore` (`/dist-site`)

**Interfaces:**
- Produces: `npm run build:site` writes `dist-site/{index,api,examples}.html`; every page loads `/js/site/main.js` with `data-page="home|api|examples"` on `<body>`.

- [ ] **Step 1:** `npm i gsap` (runtime-free: it goes in `devDependencies`, not `dependencies`).
- [ ] **Step 2:** `vite.config.site.js`: `root: src`, `base: './'`, `build.outDir: ../dist-site`, `rollupOptions.input` = the three HTML files, same aliases as `vite.config.js`. Scripts: `"build:site": "vite build --config vite.config.site.js"`, `"dev:site": "vite --config vite.config.site.js"`.
- [ ] **Step 3:** `netlify.toml`: `command = "npm run build:site"`, `publish = "dist-site"`, `NODE_VERSION = "22"`. Keep any redirect rules present (currently none).
- [ ] **Step 4:** Make the three HTML files minimal shells with shared nav (`c--nav`, active link via `aria-current="page"`), `<body data-page>` and the module script. Move the existing `src/js/index.js` demo logic out of use (deleted in Task 9).
- [ ] **Step 5:** Run `npm run build:site`. Expected: exits 0, three HTML files in `dist-site/`.
- [ ] **Step 6:** Ready for the user to commit.

### Task 2: Library fix — fade-in on first mousemove

**Files:**
- Modify: `src/js/core/CustomCursor.js` (`#init`, `#onMouseMove`), `CHANGELOG.md` (Unreleased > Fixed)
- Rebuild: `dist/` via `npm run build`

**Interfaces:**
- Produces: after construction and before the first `mousemove`, the wrapper has `hiddenClass`; the first `mousemove` removes it (unless `disable()` was called). No change to the public API or to touch behavior.

- [ ] **Step 1:** In `#init`, add `hiddenClass` to the wrapper. In `#onMouseMove`, when `this.position.x === null` and `!this.disabled`, remove `hiddenClass` before storing the position.
- [ ] **Step 2:** Verify in the browser (`npm run dev` + chrome-devtools `evaluate_script`): after load the wrapper has class `c--cursor-a--is-hidden`; after dispatching one `mousemove` it does not; after `cursor.disable()` + `mousemove` it still does.
- [ ] **Step 3:** Run `npm run build`. Expected: `dist/CustomCursor.es.js` contains the new logic; existing demo still works.
- [ ] **Step 4:** Ready for the user to commit.

### Task 3: Identity, tokens and shared cursor module

**Files:**
- Create: `src/scss/site/_tokens.scss`, `_base.scss`, `_nav.scss`, `_cursor.scss`, `src/js/site/main.js`, `src/js/site/cursor.js`, `src/js/site/motion.js`
- Modify: `src/scss/style.scss` (forwards the site partials)

**Interfaces:**
- Produces: `cursor.js` exports `cursor` (the single `CustomCursor` instance, `null` on touch devices) and `setFocus(selectorOrConfigs)` which calls `cursor.update({ focusElements })`. `motion.js` exports `reduced` (boolean from `matchMedia('(prefers-reduced-motion: reduce)')`) and `touch` (boolean). `_tokens.scss` defines the chapter palette as CSS variables `--bg-0` … `--bg-6` plus `--ink`.

- [ ] **Step 1:** Pick the sharp/editorial palette and type (builder's call) and define `--bg-0` … `--bg-6` for the 7 chapters (dark, violet, blue, coral, lime, light, dark) plus `--ink` per chapter. Verify AA contrast for each pair with a small script or the devtools contrast check; record results in the SCSS comment.
- [ ] **Step 2:** `cursor.js` creates the instance with `hideTrueCursor: true`, the cursor markup (`.c--cursor-a` with one `data-lerp="1"` dot and one `data-lerp="0.15"` ring) injected only when `!touch`; when `reduced`, force both lerps to 1.
- [ ] **Step 3:** `_cursor.scss` contains every state class used later (`--is-active`, `--second`, `--third`, `--fourth`, `--fifth`, `--sixth`, `--on-dark`) so chapters only toggle classes.
- [ ] **Step 4:** Run `npm run build:site` and open `dist-site/index.html` via `npm run dev:site`. Expected: cursor follows the mouse on all three pages, nav marks the active page, no console errors (chrome-devtools `list_console_messages`).
- [ ] **Step 5:** Ready for the user to commit.

### Task 4: Landing chapter 0 — wall of states

**Files:**
- Create: `src/js/site/chapters/wall.js`, `src/scss/site/_wall.scss`
- Modify: `src/index.html` (section `#ch-0`)

**Interfaces:**
- Consumes: `cursor`, `setFocus` from `cursor.js`.
- Produces: `initWall(): void`. Each zone is `.c--zone[data-state="dot|ring|blend|text|trail|grow|label|more"]`; entering a zone toggles its state class on the cursor via `focusElements` entries `{ elements, focusClass, mouseenter, mouseleave }`.

- [ ] **Step 1:** Build a full-viewport CSS grid of 8 zones (builder's call on exact layout), one per state, each showing its name. Each state must be visibly different (size, shape, color, `mix-blend-mode`, text label).
- [ ] **Step 2:** Wire the zones with `setFocus`. Touch/reduced: zones render as static labeled tiles.
- [ ] **Step 3:** Verify with chrome-devtools: hover each zone via `hover`, check the wrapper class changes (`evaluate_script`) and `take_screenshot` of at least three zones. Expected: eight distinct classes, no leftover class after leaving a zone.
- [ ] **Step 4:** Ready for the user to commit.

### Task 5: Chapters 1–2 — Lerp and Focus

**Files:**
- Create: `src/js/site/chapters/lerp.js`, `focus.js`, `src/scss/site/_chapters.scss`
- Modify: `src/index.html` (`#ch-1`, `#ch-2`)

**Interfaces:**
- Consumes: `cursor`, `setFocus`; `cursor.items` (each `{ el, lerp }`).
- Produces: `initLerp()`, `initFocus()`. The lerp slider writes `data-lerp` to the 3 trail pieces and mutates the matching `cursor.items[i].lerp`; it does not recreate the instance.

- [ ] **Step 1:** Lerp: a 3-piece trail (3 children with `data-lerp` 1, 0.2, 0.08) in the cursor markup shown in this chapter, plus a range input (0.02–1) that sets all piece lerps proportionally. Reduced motion: slider disabled with explanatory text.
- [ ] **Step 2:** Focus: links/cards that grow, recolor, or reshape the cursor (`focusClass` per element group).
- [ ] **Step 3:** Verify with chrome-devtools: set the slider to 1 and move the mouse; the three pieces end at the same position within one frame. At 0.05 they lag (compare positions after a `mousemove`).
- [ ] **Step 4:** Ready for the user to commit.

### Task 6: Chapters 3–5 — Text, Magnetic, Blend

**Files:**
- Create: `src/js/site/chapters/text.js`, `magnetic.js`, `blend.js`
- Modify: `src/index.html` (`#ch-3`..`#ch-5`), `_chapters.scss`

**Interfaces:**
- Consumes: `setFocus`, `gsap`.
- Produces: `initText()`, `initMagnetic()`, `initBlend()`. All behaviors live in `mouseenter`/`mouseleave` callbacks (as in the README); the library is not modified.

- [ ] **Step 1:** Text: cards with `data-cursor-text` ("View", "Drag", "Play") shown in `__artwork`.
- [ ] **Step 2:** Magnetic: buttons attract the cursor to their center and scale it to the button rect (see README magnetic example); `mouseleave` restores size.
- [ ] **Step 3:** Blend: `mix-blend-mode: difference` on a large inverted area.
- [ ] **Step 4:** Verify with chrome-devtools: hover each target, assert text content/size/blend via `evaluate_script`; leave and assert reset (no leftover text, size back to default).
- [ ] **Step 5:** Ready for the user to commit.

### Task 7: Scroll — background scrub, cursor respiro, final chapter

**Files:**
- Create: `src/js/site/scroll.js`, `chapters/final.js`
- Modify: `src/index.html` (`#ch-6`), `main.js`

**Interfaces:**
- Consumes: `cursor`, `reduced`, `touch`, all `init*` functions.
- Produces: `initScroll(): void` that (a) scrubs `document.body` background between `--bg-n` colors with ScrollTrigger, (b) calls `cursor.disable()` while scrolling and `cursor.enable()` on scroll idle (150 ms) or any `mousemove`, (c) applies each chapter's `--ink`. `initFinal()` shows `npm install @andresclua/custom-cursor` with copy to clipboard ("Copied!") and links to API/Examples.

- [ ] **Step 1:** Register ScrollTrigger; one trigger per chapter for the color scrub; `ScrollTrigger.refresh()` on `document.fonts.ready` and `resize`.
- [ ] **Step 2:** Respiro: debounce-based idle; `disable()` only if `!reduced`. In reduced mode, `initScroll` returns after setting static backgrounds.
- [ ] **Step 3:** Verify with chrome-devtools (Review Focus items 1, 3, 4): scroll with `evaluate_script window.scrollBy`, assert wrapper has `is-hidden` during scroll and not 200 ms after; emulate `prefers-reduced-motion` with `emulate` and assert it never hides; resize and assert backgrounds match the visible chapter.
- [ ] **Step 4:** Verify touch (Review Focus item 5): `emulate` a mobile device; no `.c--cursor-a` in the DOM, backgrounds set, all chapter content visible.
- [ ] **Step 5:** Ready for the user to commit.

### Task 8: API page

**Files:**
- Modify: `src/api.html`; Create: `src/js/site/api.js`, `src/scss/site/_api.scss`

**Interfaces:**
- Consumes: `cursor`, `setFocus`.
- Produces: `initApi()`. Live controls act on the page's single instance: `data-lerp` slider, `focusClass` select, `hideTrueCursor` toggle (`cursor.update({ hideTrueCursor })`), `disable`/`enable` buttons, and a "load more" button that injects a card and calls `cursor.update({})`. Other options documented from `readme.md` with copyable code.

- [ ] **Step 1:** Write the page content from `readme.md` (Options table, `focusElements` format, API methods, CSS classes), each section with its live control where listed above.
- [ ] **Step 2:** Verify with chrome-devtools: toggle `hideTrueCursor` and assert the `<style>` tag appears/disappears; click load-more, hover the new card, assert the focus class applies (proves `update({})` re-binding).
- [ ] **Step 3:** Ready for the user to commit.

### Task 9: Examples page and cleanup

**Files:**
- Modify: `src/examples.html`, `readme.md` (Live Demo link and docs pointers), `CHANGELOG.md`
- Create: `src/js/site/examples.js`
- Delete: `demo/`, `vite.config.demo.js`, `src/js/index.js`, old `src/scss/style.scss` rules no longer used

**Interfaces:**
- Consumes: `cursor`, `setFocus`.
- Produces: the 8 existing examples (Setup, Basic Focus, Custom Focus Class, Callbacks, Disable/Enable, Update Options, Generic Focus, Dynamic Content), each with a copy-to-clipboard code block.

- [ ] **Step 1:** Port each example to the new identity with its code block.
- [ ] **Step 2:** Delete the dead files listed; remove `build:demo`-style leftovers; `grep -r "demo/" . --exclude-dir=node_modules` returns no stale references.
- [ ] **Step 3:** Add a `CHANGELOG.md` entry: new site, library fade-in fix.
- [ ] **Step 4:** Final verification: `npm run build` and `npm run build:site` both exit 0; open all three pages with chrome-devtools `list_console_messages` (no errors), `lighthouse_audit` on `/` (accessibility ≥ 90).
- [ ] **Step 5:** Ready for the user to commit.

---

## Self-review

- **Spec coverage:** chapters 0–6 (Tasks 4–7), scrub + respiro (7), API/Examples (8–9), first-event fix (2), reduced motion/touch (3, 7), Netlify/URLs/cleanup (1, 9), no Pagefold (nowhere used).
- **Types:** `cursor`, `setFocus`, `reduced`, `touch`, `init*` names match across tasks.
- **Proportion:** steps name files, signatures and checks; bodies are left to the implementer.
