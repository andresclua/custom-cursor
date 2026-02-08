# @andresclua/custom-cursor

A lightweight JavaScript library for creating customizable animated cursors.

## Installation

```bash
npm install @andresclua/custom-cursor
```

## Quick Start

### Single cursor

```html
<div class="c--cursor-a"></div>
```

```js
import CustomCursor from '@andresclua/custom-cursor';

new CustomCursor({
  element: '.c--cursor-a',
  hideTrueCursor: true,
  focusElements: ['a', 'button'],
  focusClass: 'c--cursor-a--is-active',
  hiddenClass: 'c--cursor-a--is-hidden',
  clickingClass: 'c--cursor-a--second',
});
```

### Dot + Ring (dual cursor)

Two elements, two instances — the dot follows instantly, the ring follows with smooth delay via `lerp`:

```html
<div class="c--cursor-a"></div>
<div class="c--cursor-b"></div>
```

```js
import CustomCursor from '@andresclua/custom-cursor';

const dot = new CustomCursor({
  element: '.c--cursor-a',
  hideTrueCursor: true,
  focusElements: ['a', 'button'],
  focusClass: 'c--cursor-a--is-active',
  hiddenClass: 'c--cursor-a--is-hidden',
  clickingClass: 'c--cursor-a--second',
  lerp: 1,
});

const ring = new CustomCursor({
  element: '.c--cursor-b',
  focusElements: ['a', 'button'],
  focusClass: 'c--cursor-b--is-active',
  hiddenClass: 'c--cursor-b--is-hidden',
  clickingClass: 'c--cursor-b--second',
  lerp: 0.15,
});
```

```scss
.c--cursor-a {
  position: fixed;
  top: 0;
  left: 0;
  width: 8px;
  height: 8px;
  background: #111;
  border-radius: 50%;
  pointer-events: none;
  z-index: 10000;
  margin-left: -4px;
  margin-top: -4px;
  transition: width 0.2s ease, height 0.2s ease,
              margin 0.2s ease, background-color 0.2s ease,
              opacity 0.15s ease;

  &--is-hidden { opacity: 0; }
  &--is-active { background-color: #e74c3c; }
  &--second { width: 6px; height: 6px; margin-left: -3px; margin-top: -3px; }
}

.c--cursor-b {
  position: fixed;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  border: 1.5px solid #111;
  background: transparent;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  margin-left: -20px;
  margin-top: -20px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: #fff;
  font-size: 11px;
  transition: width 0.3s ease, height 0.3s ease,
              margin 0.3s ease, border-color 0.3s ease,
              opacity 0.2s ease, background-color 0.3s ease;

  &--is-hidden { opacity: 0; }
  &--is-active { border-color: #e74c3c; }
  &--second { width: 30px; height: 30px; margin-left: -15px; margin-top: -15px; }
}
```

## Payload Options

| Option           | Type     | Default                    | Description                                                   |
| ---------------- | -------- | -------------------------- | ------------------------------------------------------------- |
| `element`        | string / HTMLElement | — (required)     | The cursor DOM element or selector                            |
| `hideTrueCursor` | boolean  | `false`                    | Hide the native cursor                                        |
| `focusElements`  | string[] | `['a', 'button']`          | Selectors for default focus hover                             |
| `focusClass`     | string   | `'c--cursor-a--is-active'` | Class added on focus-element hover                            |
| `hiddenClass`    | string   | `'c--cursor-a--is-hidden'` | Class added when cursor is hidden or off-screen               |
| `clickingClass`  | string   | `'c--cursor-a--second'`    | Class added during mousedown                                  |
| `lerp`           | number   | `1`                        | Interpolation speed (0–1). `1` = instant, lower = smoother delay |

## API

### `cursor.addFocusElements(focusOpts)`

Add focus elements dynamically. Accepts a selector string, an array of selectors, or an options object:

```js
// Simple selector
cursor.addFocusElements('.js--focus');

// Object with custom class
dot.addFocusElements({ elements: '.js--grow', focusClass: 'c--cursor-a--third' });
ring.addFocusElements({ elements: '.js--grow', focusClass: 'c--cursor-b--third' });

// Object with callbacks
ring.addFocusElements({
  elements: '.js--text',
  focusClass: 'c--cursor-b--fourth',
  mouseenter(cursorEl, el) {
    cursorEl.textContent = el.dataset.cursorText || 'View';
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

### `cursor.disable()` / `cursor.enable()`

Toggle cursor visibility.

### `cursor.update(newOptions)`

Update options and re-initialize. Accepts partial payload.

```js
dot.update({ focusClass: 'c--cursor-a--third' });
ring.update({ focusClass: 'c--cursor-b--third' });
```

### `cursor.destroy()`

Remove all event listeners, cancel the animation frame, and clean up all references.

### Dynamic content (AJAX / Load More)

When new HTML is injected into the DOM, call `addFocusElements()` on the **new nodes** after they are added:

```js
const newCards = [];

for (let i = 0; i < 2; i++) {
  const card = document.createElement('div');
  card.className = 'c--card-a js--dynamic';
  card.dataset.cursorText = 'View';
  grid.appendChild(card);
  newCards.push(card);
}

// Register the NEW DOM nodes (not a selector, to avoid re-registering existing ones)
dot.addFocusElements({ elements: newCards, focusClass: 'c--cursor-a--fourth' });
ring.addFocusElements({
  elements: newCards,
  focusClass: 'c--cursor-b--fourth',
  mouseenter(cursorEl, el) {
    cursorEl.textContent = el.dataset.cursorText || 'View';
  },
  mouseleave(cursorEl) {
    cursorEl.textContent = '';
  },
});
```

## Usage with GSAP

The `mouseenter` and `mouseleave` callbacks receive the cursor element and the hovered element, so you can use GSAP (or any animation library) directly:

### Scale up on hover

```js
import gsap from 'gsap';

ring.addFocusElements({
  elements: '.js--grow',
  focusClass: 'c--cursor-b--third',
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
ring.addFocusElements({
  elements: '.js--text',
  focusClass: 'c--cursor-b--fourth',
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
ring.addFocusElements({
  elements: '.js--magnetic',
  focusClass: 'c--cursor-b--is-active',
  mouseenter(cursorEl, el) {
    const rect = el.getBoundingClientRect();
    gsap.to(cursorEl, {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      width: rect.width + 20,
      height: rect.height + 20,
      borderRadius: '12px',
      duration: 0.4, ease: 'power3.out',
    });
  },
  mouseleave(cursorEl) {
    gsap.to(cursorEl, {
      width: 40, height: 40,
      borderRadius: '50%',
      duration: 0.3, ease: 'power2.out',
    });
  },
});
```

### Color and blend mode

```js
ring.addFocusElements({
  elements: '.js--invert',
  focusClass: 'c--cursor-b--is-active',
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
      width: 40, height: 40,
      backgroundColor: 'transparent',
      mixBlendMode: 'normal',
      duration: 0.3,
    });
  },
});
```

> **Note:** When using GSAP to animate `width`, `height`, or `scale`, remove the CSS `transition` from the cursor element to avoid conflicts.

## CSS Classes Reference

All classes are configurable via the payload. These are the defaults used in the demo:

### c--cursor-a (dot)

| Class                       | When applied              |
| --------------------------- | ------------------------- |
| `c--cursor-a--is-hidden`    | Off-screen or disabled    |
| `c--cursor-a--is-active`    | Hovering a focus element  |
| `c--cursor-a--second`       | During mousedown          |
| `c--cursor-a--third`        | Grow state                |
| `c--cursor-a--fourth`       | Text mode state           |

### c--cursor-b (ring)

| Class                       | When applied              |
| --------------------------- | ------------------------- |
| `c--cursor-b--is-hidden`    | Off-screen or disabled    |
| `c--cursor-b--is-active`    | Hovering a focus element  |
| `c--cursor-b--second`       | During mousedown          |
| `c--cursor-b--third`        | Grow state                |
| `c--cursor-b--fourth`       | Text mode state           |

## License

MIT
