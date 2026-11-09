import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cursor } from './cursor.js';
import { reduced, touch } from './motion.js';

gsap.registerPlugin(ScrollTrigger);

const BG = ['#0b0b0c', '#5b3cff', '#0057ff', '#ff5a36', '#d7ff3a', '#f4f1ea', '#0b0b0c'];
const INK = ['#f4f1ea', '#ffffff', '#ffffff', '#0b0b0c', '#0b0b0c', '#0b0b0c', '#f4f1ea'];
const vars = (i) => ({ '--bg': BG[i], '--ink': INK[i] });

export function initScroll() {
	const chapters = [...document.querySelectorAll('.js--chapter')];
	const body = document.body;
	gsap.set(body, vars(0));

	// Background: scrub between chapters, or switch instantly (reduced motion / touch).
	chapters.forEach((ch, i) => {
		if (reduced || touch) {
			// Chapter i owns the band from its top to its bottom at mid-viewport, both directions.
			ScrollTrigger.create({ trigger: ch, start: 'top 50%', end: 'bottom 50%', onToggle: (s) => s.isActive && gsap.set(body, vars(i)) });
			return;
		}
		if (i === 0) return;
		gsap.fromTo(body, vars(i - 1), { ...vars(i), ease: 'none', immediateRender: false,
			scrollTrigger: { trigger: ch, start: 'top 85%', end: 'top 25%', scrub: true } });
	});

	if (!reduced && !touch) initRespiro(chapters);
	if (!reduced) initEntrances();

	document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

// The cursor dissolves while scrolling across a chapter boundary, returns when scrolling stops or the mouse really moves.
function initRespiro(chapters) {
	if (!cursor) return;
	let inBoundary = false;
	let idle;
	chapters.forEach((ch, i) => {
		if (i === 0) return;
		ScrollTrigger.create({ trigger: ch, start: 'top 85%', end: 'top 25%', onToggle: (s) => { inBoundary = s.isActive; if (!inBoundary) cursor.enable(); } });
	});
	window.addEventListener('scroll', () => {
		if (!inBoundary) return;
		cursor.disable();
		clearTimeout(idle);
		idle = setTimeout(() => cursor.enable(), 150);
	}, { passive: true });
	// Synthetic moves after a scroll have movement 0; only real movement brings the cursor back.
	window.addEventListener('mousemove', (e) => { if (e.movementX || e.movementY) { clearTimeout(idle); cursor.enable(); } });
}

// Titles reveal word by word; cards drift slightly with scroll.
function initEntrances() {
	document.querySelectorAll('.js--split').forEach((el) => {
		el.innerHTML = el.textContent.split(' ').map((w) => `<span class="u--word"><span>${w}</span></span>`).join(' ');
		gsap.from(el.querySelectorAll('.u--word > span'), { yPercent: 110, duration: 0.8, ease: 'power3.out', stagger: 0.06, scrollTrigger: { trigger: el, start: 'top 85%' } });
	});
	document.querySelectorAll('.js--parallax').forEach((el, i) => {
		gsap.fromTo(el, { y: 40 + (i % 3) * 20 }, { y: -20, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
	});
}
