import CustomCursor from '../core/CustomCursor.js';
import gsap from 'gsap';
import { reduced, touch } from './motion.js';

// One cursor per page. Three pieces: dot (instant), ring (lag), tail (long lag, shown by a state).
const base = ['a', 'button'];
const entries = [...base];
let cursor = null;
let coords = null; // label span that mirrors the pointer position while active

if (!touch) {
	const el = document.createElement('div');
	el.className = 'c--cursor-a';
	el.setAttribute('aria-hidden', 'true');
	el.innerHTML = `
		<span class="c--cursor-a__overlay" data-lerp="${reduced ? 1 : 0.07}"></span>
		<span class="c--cursor-a__artwork" data-lerp="${reduced ? 1 : 0.18}"></span>
		<span class="c--cursor-a__item" data-lerp="1"></span>`;
	document.body.appendChild(el);

	cursor = new CustomCursor({
		element: el,
		hideTrueCursor: true,
		focusElements: entries,
		focusClass: 'c--cursor-a--is-active',
		hiddenClass: 'c--cursor-a--is-hidden',
		clickingClass: 'c--cursor-a--second',
		onMove: (pos) => { if (coords) coords.textContent = `${Math.round(pos.x)} · ${Math.round(pos.y)}`; },
	});
}

let queued = false;
/** Register focus entries (strings or { elements, focusClass, mouseenter, mouseleave }). Batched into one update(). */
export function setFocus(...list) {
	entries.push(...list);
	refresh();
}

/** Re-bind focus elements (call after injecting DOM). */
export function refresh() {
	if (!cursor || queued) return;
	queued = true;
	queueMicrotask(() => {
		queued = false;
		cursor.update({ focusElements: entries });
	});
}

export { cursor };

/** Show text inside the ring. Animates an inner span (the ring's transform is owned by the library). */
export function setLabel(cursorEl, text) {
	const ring = cursorEl.querySelector('.c--cursor-a__artwork');
	ring.innerHTML = '<span class="c--cursor-a__title"></span>';
	const label = ring.firstChild;
	label.textContent = text;
	if (!reduced) gsap.fromTo(label, { scale: 0.4, opacity: 0, yPercent: 40 }, { scale: 1, opacity: 1, yPercent: 0, duration: 0.45, ease: 'back.out(2)' });
}

export function clearLabel(cursorEl) {
	cursorEl.querySelector('.c--cursor-a__artwork').textContent = '';
}

/** Label that shows the live pointer position (x · y) until stopCoords(). */
export function startCoords(cursorEl) {
	setLabel(cursorEl, '0 · 0');
	coords = cursorEl.querySelector('.c--cursor-a__title');
}

export function stopCoords(cursorEl) {
	coords = null;
	clearLabel(cursorEl);
}
