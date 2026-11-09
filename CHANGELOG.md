# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- **New website** at cursor.andresclua.com: scroll chapters (GSAP + ScrollTrigger, site only), API page with live controls, and an Examples page. The library has no new dependencies

### Fixed
- **Stuck focus class after `update()`**: calling `update()` (or `destroy()`) while the pointer is over a focus element left its class on the cursor because the `mouseleave` listener was already removed; now the class is removed on unbind and re-applied on re-bind (your `mouseenter`/`mouseleave` callbacks are not re-fired)
- **`enable()` before the first move** no longer shows the cursor at the top-left corner
- **`disable()` then a document `mouseenter`** no longer reveals a frozen cursor
- **Cursor at origin before first move**: the cursor now starts hidden (`hiddenClass`) and fades in on the first `mousemove` instead of sitting invisible at the top-left
- **`mouseup` listener leak**: a single `mouseup` listener is now registered in init and removed in `destroy()` (previously a new anonymous `{ once: true }` listener was added on every `mousedown`)

## [1.2.0] - 2026-04-22

### Removed (breaking)
- `FocusController` class, `addFocusElements()` and `removeFocusElements()`. Use `update({ focusElements })` to re-bind instead
- `cursor--clicking` and `cursor--off-screen` classes. Use the configurable `clickingClass` (default `c--cursor-a--second`) and `hiddenClass` (default `c--cursor-a--is-hidden`)

### Changed
- **Refactored** CustomCursor internals to Terra pattern for improved code consistency
- **Demo redesigned**: live demo at [cursor.andresclua.com](https://cursor.andresclua.com)

---

## [1.0.0] - 2026-02-08

### Added
- **CustomCursor class**: Lightweight custom cursor replacement with rAF-based rendering
- **FocusController class**: Manages mouseenter/mouseleave listeners with proper cleanup
- **Focus elements**: Support for selector strings and objects with custom classes and callbacks
- **`addFocusElements()`**: Dynamically add focus elements after initialization
- **`removeFocusElements()`**: Remove specific focus elements with proper listener cleanup
- **`update()`**: Update options and re-initialize at runtime
- **`disable()` / `enable()`**: Toggle cursor visibility
- **Clicking state**: `cursor--clicking` class on mousedown
- **Off-screen detection**: `cursor--off-screen` class when mouse leaves the viewport
- **Mobile detection**: Skips initialization on mobile devices
- **Method chaining**: All public methods return `this`
- **Demo page**: 6 interactive examples showcasing all features

### Fixed
- **Event listener leak**: Focus element listeners are now properly stored and removed (was creating anonymous functions)
- **rAF loop never stopped**: `cancelAnimationFrame()` is now called in `destroy()`
- **`innerHTML` usage**: Replaced with `textContent` for the style tag
- **`removeChild` usage**: Replaced with `.remove()`

### Changed
- **Complete rewrite** from PerlinDOM (Perlin noise animation library) to CustomCursor
- **Package name**: `@andresclua/perlindom` → `@andresclua/custom-cursor`
- **Build output**: `PerlinDOM.{es,umd}.js` → `CustomCursor.{es,umd}.js`
