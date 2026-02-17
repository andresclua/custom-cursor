import CustomCursor from './core/CustomCursor';

// ─── Shared callbacks ───────────────────────────────────
const textEnterFn = (cursorEl, el) => {
	cursorEl.querySelector('.c--cursor-a__artwork').textContent = el.dataset.cursorText || 'View';
};
const textLeaveFn = (cursorEl) => {
	cursorEl.querySelector('.c--cursor-a__artwork').textContent = '';
};

// ─── Focus elements config ──────────────────────────────
const baseFocusElements = [
	'a',
	'button',
	'.js--focus',
	{ elements: '.js--grow', focusClass: 'c--cursor-a--third' },
	{
		elements: '.js--text',
		focusClass: 'c--cursor-a--fourth',
		mouseenter(cursorEl, el) {
			cursorEl.querySelector('.c--cursor-a__artwork').textContent = el.dataset.cursorText || 'View';
		},
		mouseleave(cursorEl) {
			cursorEl.querySelector('.c--cursor-a__artwork').textContent = '';
		},
	},
	{
		elements: '.js--label-zone',
		focusClass: 'c--cursor-a--fifth',
		mouseenter(cursorEl, el) {
			cursorEl.querySelector('.c--cursor-a__artwork').textContent = el.dataset.cursorText || 'Hi';
		},
		mouseleave(cursorEl) {
			cursorEl.querySelector('.c--cursor-a__artwork').textContent = '';
		},
	},
	{
		elements: '.js--label',
		focusClass: 'c--cursor-a--sixth',
		mouseenter(cursorEl, el) {
			cursorEl.querySelector('.c--cursor-a__artwork').textContent = el.dataset.cursorText || 'View';
		},
		mouseleave(cursorEl, el) {
			var zone = el.closest('.js--label-zone');
			cursorEl.querySelector('.c--cursor-a__artwork').textContent = zone ? zone.dataset.cursorText : 'Hi';
		},
	},
	{
		elements: '.js--dynamic',
		focusClass: 'c--cursor-a--fourth',
		mouseenter: textEnterFn,
		mouseleave: textLeaveFn,
	},
];

// ─── Single cursor instance ─────────────────────────────
const cursor = new CustomCursor({
	element: '.c--cursor-a',
	hideTrueCursor: true,
	focusElements: baseFocusElements,
	focusClass: 'c--cursor-a--is-active',
	hiddenClass: 'c--cursor-a--is-hidden',
	clickingClass: 'c--cursor-a--second',
});

// ─── Dynamic content (Load More) ────────────────────────
const grid = document.getElementById('js--grid');
const loadMoreBtn = document.getElementById('js--load-more');
let cardCount = 2;

loadMoreBtn.addEventListener('click', () => {
	for (let i = 0; i < 2; i++) {
		cardCount++;
		const card = document.createElement('div');
		card.className = 'c--card-a js--dynamic';
		card.dataset.cursorText = String(cardCount).padStart(2, '0');
		card.textContent = `Card ${String(cardCount).padStart(2, '0')}`;
		grid.appendChild(card);
	}

	cursor.update({});
});

// ─── Disable / Enable toggle ────────────────────────────
const toggleBtn = document.getElementById('js--toggle');
let isDisabled = false;

toggleBtn.addEventListener('click', () => {
	isDisabled = !isDisabled;
	if (isDisabled) {
		cursor.disable();
		toggleBtn.textContent = 'Enable Cursor';
		toggleBtn.classList.add('c--btn-a--is-active');
	} else {
		cursor.enable();
		toggleBtn.textContent = 'Disable Cursor';
		toggleBtn.classList.remove('c--btn-a--is-active');
	}
});

// ─── Update options dynamically ─────────────────────────
const updateBtn = document.getElementById('js--update');
let isLarge = false;

updateBtn.addEventListener('click', () => {
	isLarge = !isLarge;
	if (isLarge) {
		cursor.update({ focusClass: 'c--cursor-a--third' });
		updateBtn.textContent = 'Revert Cursor';
		updateBtn.classList.add('c--btn-a--is-active');
	} else {
		cursor.update({ focusClass: 'c--cursor-a--is-active' });
		updateBtn.textContent = 'Toggle Large Cursor';
		updateBtn.classList.remove('c--btn-a--is-active');
	}
});
