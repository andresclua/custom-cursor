import { cursor } from './cursor.js';

const NAMES = { 'is-active': 'focus', second: 'click', third: 'grow', fourth: 'text', fifth: 'blend', sixth: 'label',
	seventh: 'trail', eighth: 'square', ninth: 'dot', tenth: 'ring', 'is-hidden': 'hidden' };

// Fixed readout of the cursor's current state, so every change is visible on the page too.
export function initHud() {
	if (!cursor) return;
	const el = document.createElement('div');
	el.className = 'c--hud-a u--mono';
	el.setAttribute('aria-hidden', 'true');
	el.innerHTML = '<span class="c--hud-a__category">cursor</span> <strong class="c--hud-a__title"></strong><span class="c--hud-a__content"></span>';
	document.body.appendChild(el);
	const state = el.querySelector('.c--hud-a__title');
	const klass = el.querySelector('.c--hud-a__content');
	let last = '';
	const render = () => {
		const mods = [...cursor.DOM.element.classList].filter((c) => c.startsWith('c--cursor-a--'));
		const key = mods.join(' ');
		if (key === last) return;
		last = key;
		const names = mods.map((c) => NAMES[c.replace('c--cursor-a--', '')] || c.replace('c--cursor-a--', ''));
		state.textContent = names.length ? names.join(' + ') : 'default';
		klass.textContent = mods.length ? mods.join(' ') : 'no modifier class';
		state.animate([{ transform: 'translateY(4px)', opacity: 0.2 }, { transform: 'none', opacity: 1 }], { duration: 220, easing: 'ease-out' });
	};
	new MutationObserver(render).observe(cursor.DOM.element, { attributes: true, attributeFilter: ['class'] });
	render();
}
