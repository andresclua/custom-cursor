import { cursor, setFocus } from '../cursor.js';
import { reduced } from '../motion.js';

export function initLerp() {
	const input = document.getElementById('js--lerp');
	const out = document.getElementById('js--lerp-out');
	setFocus({ elements: '.js--lerp-pad', focusClass: 'c--cursor-a--seventh' });
	if (!cursor || reduced) { input.disabled = true; return; }
	// cursor.items order = DOM order: tail, ring, dot (dot stays instant)
	const apply = () => {
		const v = parseFloat(input.value);
		out.textContent = v.toFixed(2);
		cursor.items[0].lerp = v * 0.4;
		cursor.items[1].lerp = v;
	};
	input.addEventListener('input', apply);
	apply();
}
