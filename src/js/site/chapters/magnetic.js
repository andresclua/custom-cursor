import gsap from 'gsap';
import { setFocus } from '../cursor.js';
import { reduced, touch } from '../motion.js';

// The button leans toward the pointer; the cursor grows around it.
export function initMagnetic() {
	setFocus({ elements: '.js--magnetic', focusClass: 'c--cursor-a--third' });
	if (reduced || touch) return;
	document.querySelectorAll('.js--magnetic').forEach((el) => {
		el.addEventListener('mousemove', (e) => {
			const r = el.getBoundingClientRect();
			gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.35, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.3, ease: 'power2.out' });
		});
		el.addEventListener('mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' }));
	});
}
