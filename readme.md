# @andresclua/custom-cursor

A lightweight JavaScript library for creating customizable animated cursors.

## Installation

```bash
npm install @andresclua/custom-cursor
```

## Quick Start

### Single cursor

```html
<div class="custom-cursor"></div>
```

```js
import CustomCursor from '@andresclua/custom-cursor';

const cursor = new CustomCursor('.custom-cursor', {
  hideTrueCursor: true,
  focusElements: ['a', 'button'],
  focusClass: 'cursor--focused',
});

cursor.initialize();
```

### Dot + Ring (dual cursor)

Use two elements and two instances — the dot follows instantly, the ring follows with a smooth delay via `lerp`:

```html
<div class="custom-cursor custom-cursor--dot"></div>
<div class="custom-cursor custom-cursor--ring"></div>
```

```js
import CustomCursor from '@andresclua/custom-cursor';

// Dot — instant follow
const dot = new CustomCursor('.custom-cursor--dot', {
  hideTrueCursor: true,
  focusElements: ['a', 'button'],
  focusClass: 'cursor--focused',
  lerp: 1,
});

// Ring — smooth delayed follow
const ring = new CustomCursor('.custom-cursor--ring', {
  focusElements: ['a', 'button'],
  focusClass: 'cursor--focused',
  lerp: 0.15,
});

dot.initialize();
ring.initialize();
```

```css
.custom-cursor {
  position: fixed;
  top: 0;
  left: 0;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
}

.custom-cursor--dot {
  width: 8px;
  height: 8px;
  background: #111;
  margin-left: -4px;
  margin-top: -4px;
  z-index: 10000;
  transition: background-color 0.2s ease, opacity 0.15s ease;
}

.custom-cursor--ring {
  width: 40px;
  height: 40px;
  border: 1.5px solid #111;
  background: transparent;
  margin-left: -20px;
  margin-top: -20px;
  transition: width 0.3s ease, height 0.3s ease, border-color 0.3s ease, opacity 0.2s ease;
}
```

## Options

| Option           | Type     | Default              | Description                        |
| ---------------- | -------- | -------------------- | ---------------------------------- |
| `hideTrueCursor` | boolean  | `false`              | Hide the native cursor             |
| `focusElements`  | string[] | `['a', 'button']`    | Selectors for default focus hover  |
| `focusClass`     | string   | `'cursor--focused'`  | Class added on focus-element hover |
| `lerp`           | number   | `1`                  | Interpolation speed (0–1). `1` = instant, lower = smoother delay |

## API

### `cursor.initialize()`

Initialize the cursor. Skips on mobile.

### `cursor.destroy()`

Remove all event listeners, cancel the animation frame, and clean up.

### `cursor.disable()` / `cursor.enable()`

Toggle cursor visibility.

### `cursor.update(newOptions)`

Update options and re-initialize. Accepts partial options object.

```js
cursor.update({ focusClass: 'cursor--grow' });
```

### `cursor.addFocusElements(focusOpts)`

Add focus elements dynamically. Accepts a selector string, an array of selectors, or an options object:

```js
// Simple selector
cursor.addFocusElements('.my-cards');

// Object with custom class
cursor.addFocusElements({
  elements: '.js--grow',
  focusClass: 'cursor--grow',
});

// Object with callbacks
cursor.addFocusElements({
  elements: '.js--text',
  focusClass: 'cursor--text-mode',
  mouseenter(cursorEl) {
    cursorEl.textContent = 'View';
  },
  mouseleave(cursorEl) {
    cursorEl.textContent = '';
  },
});
```

### `cursor.removeFocusElements(elements)`

Remove focus listeners from specific elements. Accepts a selector string, NodeList, or array.

```js
cursor.removeFocusElements('.js--grow');
```

All methods return `this` for chaining:

```js
cursor.initialize().addFocusElements('.cards').disable();
```

## Usage with GSAP

The `mouseenter` and `mouseleave` callbacks receive the cursor element and the hovered element, so you can use GSAP (or any animation library) directly:

### Scale up on hover

```js
import gsap from 'gsap';

cursor.addFocusElements({
  elements: '.js--grow',
  focusClass: 'cursor--grow',
  mouseenter(cursorEl) {
    gsap.to(cursorEl, { scale: 2.5, duration: 0.3, ease: 'power2.out' });
  },
  mouseleave(cursorEl) {
    gsap.to(cursorEl, { scale: 1, duration: 0.3, ease: 'power2.out' });
  },
});
```

### Show text with animation

```js
cursor.addFocusElements({
  elements: '.js--text',
  focusClass: 'cursor--text-mode',
  mouseenter(cursorEl, el) {
    cursorEl.textContent = el.dataset.cursorText || 'View';
    gsap.fromTo(cursorEl,
      { width: 20, height: 20, opacity: 0.5 },
      { width: 80, height: 80, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
    );
  },
  mouseleave(cursorEl) {
    gsap.to(cursorEl, {
      width: 20, height: 20, opacity: 1, duration: 0.3, ease: 'power2.in',
      onComplete: () => { cursorEl.textContent = ''; },
    });
  },
});
```

### Magnetic effect (cursor sticks to element center)

```js
cursor.addFocusElements({
  elements: '.js--magnetic',
  focusClass: 'cursor--focused',
  mouseenter(cursorEl, el) {
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    gsap.to(cursorEl, {
      x: centerX, y: centerY,
      width: rect.width + 20, height: rect.height + 20,
      borderRadius: '12px',
      duration: 0.4, ease: 'power3.out',
    });
  },
  mouseleave(cursorEl) {
    gsap.to(cursorEl, {
      width: 20, height: 20,
      borderRadius: '50%',
      duration: 0.3, ease: 'power2.out',
    });
  },
});
```

### Color and blend mode

```js
cursor.addFocusElements({
  elements: '.js--invert',
  focusClass: 'cursor--invert',
  mouseenter(cursorEl) {
    gsap.to(cursorEl, {
      width: 60, height: 60,
      backgroundColor: '#fff',
      mixBlendMode: 'difference',
      duration: 0.3,
    });
  },
  mouseleave(cursorEl) {
    gsap.to(cursorEl, {
      width: 20, height: 20,
      backgroundColor: '#111',
      mixBlendMode: 'normal',
      duration: 0.3,
    });
  },
});
```

> **Note:** When using GSAP to animate `width`, `height`, or `scale`, remove the CSS `transition` from `.custom-cursor` to avoid conflicts between CSS transitions and GSAP.

## CSS Classes

| Class                | When applied                      |
| -------------------- | --------------------------------- |
| `cursor--initialized`| After `initialize()`              |
| `cursor--off-screen` | Mouse leaves the viewport         |
| `cursor--disabled`   | After `disable()`                 |
| `cursor--clicking`   | During mousedown → mouseup        |
| `cursor--focused`    | Hovering a default focus element  |

Add your own classes via `focusClass` option or `addFocusElements()`.

## Minimal CSS (single cursor)

```css
.custom-cursor {
  position: fixed;
  top: 0;
  left: 0;
  width: 20px;
  height: 20px;
  background: #111;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transform: translate3d(0, 0, 0);
  transition: width 0.25s ease, height 0.25s ease, background-color 0.25s ease, opacity 0.2s ease;
  margin-left: -10px;
  margin-top: -10px;
}

.cursor--off-screen,
.cursor--disabled {
  opacity: 0;
}

.cursor--clicking {
  width: 14px;
  height: 14px;
  margin-left: -7px;
  margin-top: -7px;
}

.cursor--focused {
  background-color: #e74c3c;
}
```

## License

MIT
