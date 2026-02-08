# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
