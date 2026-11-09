import { cursor, setFocus, refresh, setLabel, clearLabel } from './cursor.js';
import { reduced } from './motion.js';

// Live controls act on this page's single cursor instance.
export function initApi() {
	setFocus('.js--try', {
		elements: '.js--dynamic',
		focusClass: 'c--cursor-a--fourth',
		mouseenter: (c, el) => setLabel(c, el.dataset.cursorText),
		mouseleave: (c) => clearLabel(c),
	});
	if (!cursor) return;

	const lerp = document.getElementById('js--lerp');
	const out = document.getElementById('js--lerp-out');
	if (reduced) lerp.disabled = true;
	lerp.addEventListener('input', () => {
		const v = parseFloat(lerp.value);
		out.textContent = v.toFixed(2);
		cursor.items[0].lerp = v * 0.4; // tail
		cursor.items[1].lerp = v;       // ring
	});

	document.getElementById('js--focus-class').addEventListener('change', (e) => cursor.update({ focusClass: e.target.value }));
	document.getElementById('js--hide-true').addEventListener('change', (e) => cursor.update({ hideTrueCursor: e.target.checked }));
	document.getElementById('js--disable').addEventListener('click', () => cursor.disable());
	document.getElementById('js--enable').addEventListener('click', () => cursor.enable());

	let n = 0;
	document.getElementById('js--load-more').addEventListener('click', () => {
		const card = document.createElement('div');
		card.className = 'c--card-a c--card-a--fifth js--dynamic';
		card.dataset.cursorText = 'New';
		card.textContent = `Card ${++n}`;
		document.getElementById('js--grid').appendChild(card);
		refresh(); // update({}) re-evaluates selectors and binds the new card
	});
}
