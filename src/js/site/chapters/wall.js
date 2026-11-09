import { copyText } from '../code.js';
import { fullExample } from '../snippets.js';
import { setFocus, setLabel, clearLabel, startCoords, stopCoords } from '../cursor.js';

// zone data-state → [focus class suffix, optional text shown in the ring]
const STATES = {
	dot: ['ninth'], ring: ['tenth'], blend: ['fifth'], text: ['fourth', 'View'],
	trail: ['seventh'], grow: ['third'], label: ['sixth', '@coords'], more: ['eighth'],
};

export function initWall() {
	const copy = document.querySelector('.js--copy-setup');
	if (copy) copy.addEventListener('click', () => copyText(fullExample('setup'), copy));
	const entries = Object.entries(STATES).map(([state, [cls, text]]) => ({
		elements: `.js--zone[data-state="${state}"]`,
		focusClass: `c--cursor-a--${cls}`,
		mouseenter: (c) => { if (text === '@coords') startCoords(c); else if (text) setLabel(c, text); },
		mouseleave: (c) => { if (text === '@coords') stopCoords(c); else clearLabel(c); },
	}));
	setFocus(...entries);
}
