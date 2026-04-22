import CustomCursor from './core/CustomCursor';

// ─── Shared callbacks ───────────────────────────────────
const textEnterFn = (cursorEl, el) => {
	cursorEl.querySelector('.c--cursor-a__artwork').textContent = el.dataset.cursorText || 'View';
};
const textLeaveFn = (cursorEl) => {
	cursorEl.querySelector('.c--cursor-a__artwork').textContent = '';
};

// ─── Cursor ─────────────────────────────────────────────
const cursor = new CustomCursor({
	element: '.c--cursor-a',
	hideTrueCursor: true,
	focusElements: [
		'a',
		'button',
		'.js--focus',
		{ elements: '.js--grow', focusClass: 'c--cursor-a--third' },
		{
			elements: '.js--text',
			focusClass: 'c--cursor-a--fourth',
			mouseenter: textEnterFn,
			mouseleave: textLeaveFn,
		},
		{
			elements: '.js--dynamic',
			focusClass: 'c--cursor-a--fourth',
			mouseenter: textEnterFn,
			mouseleave: textLeaveFn,
		},
	],
	focusClass:    'c--cursor-a--is-active',
	hiddenClass:   'c--cursor-a--is-hidden',
	clickingClass: 'c--cursor-a--second',
});

// ─── Dark surface color switch ───────────────────────────
const cursorEl = document.querySelector('.c--cursor-a');
const darkSurfaces = [
	document.querySelector('.hero'),
	document.querySelector('.footer'),
	...document.querySelectorAll('.example__code'),
];

darkSurfaces.forEach(el => {
	if (!el) return;
	el.addEventListener('mouseenter', () => cursorEl.classList.add('c--cursor-a--on-dark'));
	el.addEventListener('mouseleave', () => cursorEl.classList.remove('c--cursor-a--on-dark'));
});

// ─── Clipboard copy ─────────────────────────────────────
document.querySelectorAll('.js--copy').forEach(el => {
	el.addEventListener('click', () => {
		navigator.clipboard.writeText(el.dataset.copy).then(() => {
			el.classList.add('hero__install--copied');
			const text = el.querySelector('.hero__install-text');
			const orig = text.textContent;
			text.textContent = 'Copied!';
			setTimeout(() => {
				text.textContent = orig;
				el.classList.remove('hero__install--copied');
			}, 1800);
		});
	});
});

// ─── Disable / Enable ───────────────────────────────────
const toggleBtn = document.getElementById('js--toggle');
let isDisabled = false;

toggleBtn.addEventListener('click', () => {
	isDisabled = !isDisabled;
	if (isDisabled) {
		cursor.disable();
		toggleBtn.textContent = 'Enable Cursor';
		toggleBtn.classList.add('demo-btn--active');
	} else {
		cursor.enable();
		toggleBtn.textContent = 'Disable Cursor';
		toggleBtn.classList.remove('demo-btn--active');
	}
});

// ─── Update options ─────────────────────────────────────
const updateBtn = document.getElementById('js--update');
let isLarge = false;

updateBtn.addEventListener('click', () => {
	isLarge = !isLarge;
	cursor.update({ focusClass: isLarge ? 'c--cursor-a--third' : 'c--cursor-a--is-active' });
	updateBtn.textContent = isLarge ? 'Revert Cursor' : 'Toggle Large Cursor';
	updateBtn.classList.toggle('demo-btn--active', isLarge);
});

// ─── Load More ──────────────────────────────────────────
const grid = document.getElementById('js--grid');
const loadMoreBtn = document.getElementById('js--load-more');
let cardCount = 2;

loadMoreBtn.addEventListener('click', () => {
	for (let i = 0; i < 2; i++) {
		cardCount++;
		const card = document.createElement('div');
		card.className = 'demo-grid-card js--dynamic';
		card.dataset.cursorText = String(cardCount).padStart(2, '0');
		card.textContent = `Card ${String(cardCount).padStart(2, '0')}`;
		grid.appendChild(card);
	}
	cursor.update({});
});
