// Full, paste-ready examples: HTML + SCSS + JS. The SCSS is the site's real cursor stylesheet (imported raw, so it never drifts).
import cursorScss from '../../scss/site/_cursor.scss?raw';

const HTML_CURSOR = `<div class="c--cursor-a" aria-hidden="true">
  <span class="c--cursor-a__overlay" data-lerp="0.07"></span>
  <span class="c--cursor-a__artwork" data-lerp="0.18"></span>
  <span class="c--cursor-a__item" data-lerp="1"></span>
</div>`;

const SCSS = `:root { --ink: #111; --bg: #fff; } // cursor color and the color behind it\n\n${cursorScss.trim()}`;

const JS_HEAD = "import CustomCursor from '@andresclua/custom-cursor';\n\n";

// key -> { html: demo markup, js: how it is wired }
const EXAMPLES = {
	setup: { html: '', js: `const cursor = new CustomCursor({
  element: '.c--cursor-a',
  hideTrueCursor: true,
  focusElements: ['a', 'button'],
});` },
	basic: { html: '<a href="#">A link</a>\n<button type="button">A button</button>', js: `const cursor = new CustomCursor({
  element: '.c--cursor-a',
  hideTrueCursor: true,
  focusElements: ['a', 'button'],
});` },
	grow: { html: '<div class="js--grow">Grow</div>', js: `const cursor = new CustomCursor({
  element: '.c--cursor-a',
  hideTrueCursor: true,
  focusElements: [{ elements: '.js--grow', focusClass: 'c--cursor-a--third' }],
});` },
	callbacks: { html: '<div class="js--text" data-cursor-text="View">One</div>\n<div class="js--text" data-cursor-text="Play">Two</div>', js: `const ring = document.querySelector('.c--cursor-a__artwork');

const cursor = new CustomCursor({
  element: '.c--cursor-a',
  hideTrueCursor: true,
  focusElements: [{
    elements: '.js--text',
    focusClass: 'c--cursor-a--fourth',
    mouseenter(cursorEl, el) { ring.textContent = el.dataset.cursorText; },
    mouseleave() { ring.textContent = ''; },
  }],
});` },
	toggle: { html: '<button id="off" type="button">disable()</button>\n<button id="on" type="button">enable()</button>', js: `const cursor = new CustomCursor({
  element: '.c--cursor-a',
  hideTrueCursor: true,
});

document.getElementById('off').addEventListener('click', () => cursor.disable());
document.getElementById('on').addEventListener('click', () => cursor.enable());` },
	update: { html: '<button class="js--set" data-class="c--cursor-a--is-active" type="button">default</button>\n<button class="js--set" data-class="c--cursor-a--third" type="button">grow</button>\n<div class="js--try">Hover me after choosing</div>', js: `const cursor = new CustomCursor({
  element: '.c--cursor-a',
  hideTrueCursor: true,
  focusElements: ['button', '.js--try'],
});

document.querySelectorAll('.js--set').forEach((b) => {
  b.addEventListener('click', () => cursor.update({ focusClass: b.dataset.class }));
});` },
	generic: { html: '<div class="js--generic">Card</div>\n<span class="js--generic">Tag</span>', js: `const cursor = new CustomCursor({
  element: '.c--cursor-a',
  hideTrueCursor: true,
  focusElements: ['a', 'button', '.js--generic'],
});` },
	dynamic: { html: '<button id="more" type="button">Load more</button>\n<div id="grid"></div>', js: `const cursor = new CustomCursor({
  element: '.c--cursor-a',
  hideTrueCursor: true,
  focusElements: ['button', '.js--dynamic'],
});

let n = 0;
document.getElementById('more').addEventListener('click', () => {
  const card = document.createElement('div');
  card.className = 'js--dynamic';
  card.textContent = 'Card ' + (++n);
  document.getElementById('grid').appendChild(card);
  cursor.update({}); // re-evaluates selectors so the new card is picked up
});` },
};

/** Complete example as one block: cursor markup + demo markup + SCSS + JS. */
export function fullExample(key) {
	const ex = EXAMPLES[key] || EXAMPLES.setup;
	const html = ex.html ? `${HTML_CURSOR}\n\n${ex.html}` : HTML_CURSOR;
	return `<!-- HTML -->\n${html}\n\n/* SCSS */\n${SCSS}\n\n// JS\n${JS_HEAD}${ex.js}\n`;
}
