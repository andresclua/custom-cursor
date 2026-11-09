import { cursor, setFocus, refresh, setLabel, clearLabel } from './cursor.js';

export function initExamples() {
	setFocus(
		{ elements: '.js--grow', focusClass: 'c--cursor-a--third' },
		{
			elements: '.js--text', focusClass: 'c--cursor-a--fourth',
			mouseenter: (c, el) => setLabel(c, el.dataset.cursorText || 'View'),
			mouseleave: (c) => clearLabel(c),
		},
		'.js--generic', '.js--try',
		{
			elements: '.js--dynamic', focusClass: 'c--cursor-a--fourth',
			mouseenter: (c, el) => setLabel(c, el.dataset.cursorText),
			mouseleave: (c) => clearLabel(c),
		},
	);
	if (!cursor) return;
	document.getElementById('js--disable').addEventListener('click', () => cursor.disable());
	document.getElementById('js--enable').addEventListener('click', () => cursor.enable());
	document.querySelectorAll('.js--set-class').forEach((b) => b.addEventListener('click', () => cursor.update({ focusClass: b.dataset.class })));
	let n = 0;
	document.getElementById('js--load-more').addEventListener('click', () => {
		const card = document.createElement('div');
		card.className = 'c--card-a c--card-a--fifth js--dynamic';
		card.dataset.cursorText = 'New';
		card.textContent = `Card ${++n}`;
		document.getElementById('js--grid').appendChild(card);
		refresh();
	});
}
