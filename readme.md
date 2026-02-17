# @andresclua/custom-cursor

A lightweight JavaScript library for creating customizable animated cursors.

## Installation

```bash
npm install @andresclua/custom-cursor
```

## Quick Start

```html
<div class="c--cursor-a">
  <span class="c--cursor-a__item" data-lerp="1"></span>
  <span class="c--cursor-a__artwork" data-lerp="0.15"></span>
</div>
```

```js
import CustomCursor from '@andresclua/custom-cursor';

const cursor = new CustomCursor({
  element: '.c--cursor-a',
  hideTrueCursor: true,
  focusElements: [
    'a',
    'button',
    { elements: '.js--grow', focusClass: 'c--cursor-a--third' },
    {
      elements: '.js--text',
      focusClass: 'c--cursor-a--fourth',
      mouseenter(cursorEl, el) {
        cursorEl.querySelector('.c--cursor-a__artwork').textContent =
          el.dataset.cursorText || 'View';
      },
      mouseleave(cursorEl) {
        cursorEl.querySelector('.c--cursor-a__artwork').textContent = '';
      },
    },
  ],
  focusClass: 'c--cursor-a--is-active',
  hiddenClass: 'c--cursor-a--is-hidden',
  clickingClass: 'c--cursor-a--second',
  onInit(cursorEl) { /* ... */ },
  onDestroy(cursorEl) { /* ... */ },
  onMove(position, cursorEl) { /* ... */ },
});
```

```scss
.c--cursor-a {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 10000;

  &--is-hidden {
    .c--cursor-a__item,
    .c--cursor-a__artwork { opacity: 0; }
  }

  &--is-active {
    .c--cursor-a__item { background-color: #e74c3c; }
    .c--cursor-a__artwork { border-color: #e74c3c; }
  }

  &__item {
    position: fixed;
    top: 0;
    left: 0;
    border-radius: 50%;
    pointer-events: none;
    width: 8px;
    height: 8px;
    background: #111;
    margin-left: -4px;
    margin-top: -4px;
  }

  &__artwork {
    position: fixed;
    top: 0;
    left: 0;
    border-radius: 50%;
    pointer-events: none;
    width: 40px;
    height: 40px;
    border: 1.5px solid #111;
    margin-left: -20px;
    margin-top: -20px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    color: #fff;
    font-size: 11px;
  }
}
```

Children with `data-lerp` are auto-discovered. `1` = instant, lower values = smoother delay.

## Options

| Option           | Type               | Default                    | Description                                                   |
| ---------------- | ------------------ | -------------------------- | ------------------------------------------------------------- |
| `element`        | string / HTMLElement | — (required)             | The cursor DOM element or selector                            |
| `hideTrueCursor` | boolean            | `false`                    | Hide the native cursor                                        |
| `disableTouch`   | boolean            | `true`                     | Do not initialize on touch devices                            |
| `focusElements`  | Array              | `['a', 'button']`          | Selectors and/or objects for focus hover (see below)          |
| `focusClass`     | string             | `'c--cursor-a--is-active'` | Default class added on focus-element hover                    |
| `hiddenClass`    | string             | `'c--cursor-a--is-hidden'` | Class added when cursor is hidden or off-screen               |
| `clickingClass`  | string             | `'c--cursor-a--second'`    | Class added during mousedown                                  |
| `onInit`         | Function           | `null`                     | Callback after init — receives `(cursorEl)`                   |
| `onDestroy`      | Function           | `null`                     | Callback after destroy — receives `(cursorEl)`                |
| `onMove`         | Function           | `null`                     | Callback each frame — receives `(position, cursorEl)`         |

### `focusElements` format

The array accepts strings (CSS selectors) and objects with optional callbacks:

```js
focusElements: [
  // Simple selector — uses default focusClass
  'a',
  'button',

  // Custom focusClass
  { elements: '.js--grow', focusClass: 'c--cursor-a--third' },

  // Custom focusClass + callbacks
  {
    elements: '.js--text',
    focusClass: 'c--cursor-a--fourth',
    mouseenter(cursorEl, el) { /* ... */ },
    mouseleave(cursorEl, el) { /* ... */ },
  },
]
```

| Property      | Type                | Description                                    |
| ------------- | ------------------- | ---------------------------------------------- |
| `elements`    | string / NodeList / Array / Element | Selector or DOM references        |
| `focusClass`  | string              | Class to add on hover (falls back to default)  |
| `mouseenter`  | Function            | Callback on enter — receives `(cursorEl, el)`  |
| `mouseleave`  | Function            | Callback on leave — receives `(cursorEl, el)`  |

## API

### `cursor.update(newOptions)`

Merge new options and re-bind focus elements. Does **not** destroy the instance — the rAF loop and document listeners stay alive.

```js
// Change the default focusClass
cursor.update({ focusClass: 'c--cursor-a--third' });

// Re-bind after injecting new DOM nodes (selectors are re-evaluated)
cursor.update({});
```

### `cursor.disable()` / `cursor.enable()`

Toggle cursor visibility.

```js
cursor.disable();
cursor.enable();
```

### `cursor.destroy()`

Remove all event listeners, cancel the animation frame, and clean up all references.

```js
cursor.destroy();
```

### Dynamic content (AJAX / Load More)

When new HTML is injected into the DOM, call `update({})` so selectors are re-evaluated and new nodes are picked up:

```js
const grid = document.getElementById('js--grid');

document.getElementById('js--load-more').addEventListener('click', () => {
  const card = document.createElement('div');
  card.className = 'c--card-a js--dynamic';
  card.dataset.cursorText = 'New';
  grid.appendChild(card);

  // Re-bind — .js--dynamic selector picks up the new card
  cursor.update({});
});
```

## Usage with GSAP

The `mouseenter` and `mouseleave` callbacks receive the cursor element and the hovered element, so you can use GSAP (or any animation library) directly inside the constructor:

### Scale up on hover

```js
import gsap from 'gsap';

const cursor = new CustomCursor({
  element: '.c--cursor-a',
  focusElements: [
    {
      elements: '.js--grow',
      focusClass: 'c--cursor-a--third',
      mouseenter(cursorEl) {
        gsap.to(cursorEl, { scale: 2.5, duration: 0.3, ease: 'power2.out' });
      },
      mouseleave(cursorEl) {
        gsap.to(cursorEl, { scale: 1, duration: 0.3, ease: 'power2.out' });
      },
    },
  ],
});
```

### Show text with animation

```js
const cursor = new CustomCursor({
  element: '.c--cursor-a',
  focusElements: [
    {
      elements: '.js--text',
      focusClass: 'c--cursor-a--fourth',
      mouseenter(cursorEl, el) {
        cursorEl.querySelector('.c--cursor-a__artwork').textContent =
          el.dataset.cursorText || 'View';
        gsap.fromTo(cursorEl.querySelector('.c--cursor-a__artwork'),
          { width: 20, height: 20, opacity: 0.5 },
          { width: 80, height: 80, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
        );
      },
      mouseleave(cursorEl) {
        gsap.to(cursorEl.querySelector('.c--cursor-a__artwork'), {
          width: 20, height: 20, opacity: 1, duration: 0.3, ease: 'power2.in',
          onComplete: () => {
            cursorEl.querySelector('.c--cursor-a__artwork').textContent = '';
          },
        });
      },
    },
  ],
});
```

### Magnetic effect (cursor sticks to element center)

```js
const cursor = new CustomCursor({
  element: '.c--cursor-a',
  focusElements: [
    {
      elements: '.js--magnetic',
      focusClass: 'c--cursor-a--is-active',
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
    },
  ],
});
```

### Color and blend mode

```js
const cursor = new CustomCursor({
  element: '.c--cursor-a',
  focusElements: [
    {
      elements: '.js--invert',
      focusClass: 'c--cursor-a--is-active',
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
    },
  ],
});
```

> **Note:** When using GSAP to animate `width`, `height`, or `scale`, remove the CSS `transition` from the cursor element to avoid conflicts.

## CSS Classes Reference

All classes are configurable via options. These are the defaults used in the demo:

| Class                       | When applied              |
| --------------------------- | ------------------------- |
| `c--cursor-a--is-hidden`    | Off-screen or disabled    |
| `c--cursor-a--is-active`    | Hovering a focus element  |
| `c--cursor-a--second`       | During mousedown          |
| `c--cursor-a--third`        | Grow state                |
| `c--cursor-a--fourth`       | Text mode state           |
| `c--cursor-a--fifth`        | Label zone state          |
| `c--cursor-a--sixth`        | Label card hover state    |

## License

MIT
