import gsap from 'gsap';
import { setFocus, setLabel, clearLabel } from '../cursor.js';
import { reduced } from '../motion.js';

// Callbacks do two things at once: write into the cursor and move the card under it.
export function initText() {
	setFocus({
		elements: '.js--text',
		focusClass: 'c--cursor-a--fourth',
		mouseenter: (c, el) => {
			setLabel(c, el.dataset.cursorText || 'View');
			if (!reduced) {
				gsap.to(el, { scale: 1.04, duration: 0.5, ease: 'power3.out' });
				gsap.to(el.querySelector('.c--card-a__artwork'), { yPercent: -8, scale: 1.12, duration: 0.6, ease: 'power3.out' });
			}
		},
		mouseleave: (c, el) => {
			clearLabel(c);
			if (!reduced) {
				gsap.to(el, { scale: 1, duration: 0.5, ease: 'power3.out' });
				gsap.to(el.querySelector('.c--card-a__artwork'), { yPercent: 0, scale: 1, duration: 0.6, ease: 'power3.out' });
			}
		},
	});
}
