import CustomCursor from './core/CustomCursor';

// ─── Dot (inner circle, instant follow) ─────────────────
const dot = new CustomCursor({
	element: '.c--cursor-a',
	hideTrueCursor: true,
	focusElements: ['a', 'button', '.js--focus'],
	focusClass: 'c--cursor-a--is-active',
	hiddenClass: 'c--cursor-a--is-hidden',
	clickingClass: 'c--cursor-a--second',
	lerp: 1,
});

// ─── Ring (outer circle, smooth follow) ─────────────────
const ring = new CustomCursor({
	element: '.c--cursor-b',
	focusElements: ['a', 'button', '.js--focus'],
	focusClass: 'c--cursor-b--is-active',
	hiddenClass: 'c--cursor-b--is-hidden',
	clickingClass: 'c--cursor-b--second',
	lerp: 0.15,
});

// ─── 2. Grow cards ──────────────────────────────────────
dot.addFocusElements({ elements: '.js--grow', focusClass: 'c--cursor-a--third' });
ring.addFocusElements({ elements: '.js--grow', focusClass: 'c--cursor-b--third' });

// ─── 3. Text cards (callbacks) ──────────────────────────
dot.addFocusElements({ elements: '.js--text', focusClass: 'c--cursor-a--fourth' });
ring.addFocusElements({
	elements: '.js--text',
	focusClass: 'c--cursor-b--fourth',
	mouseenter(cursorEl, el) {
		cursorEl.textContent = el.dataset.cursorText || 'View';
	},
	mouseleave(cursorEl) {
		cursorEl.textContent = '';
	},
});

// ─── 7. Dynamic content (Load More) ────────────────────
const textEnterFn = (cursorEl, el) => {
	cursorEl.textContent = el.dataset.cursorText || 'View';
};
const textLeaveFn = (cursorEl) => {
	cursorEl.textContent = '';
};

dot.addFocusElements({ elements: '.js--dynamic', focusClass: 'c--cursor-a--fourth' });
ring.addFocusElements({
	elements: '.js--dynamic',
	focusClass: 'c--cursor-b--fourth',
	mouseenter: textEnterFn,
	mouseleave: textLeaveFn,
});

const grid = document.getElementById('js--grid');
const loadMoreBtn = document.getElementById('js--load-more');
let cardCount = 2;

loadMoreBtn.addEventListener('click', () => {
	const newCards = [];

	for (let i = 0; i < 2; i++) {
		cardCount++;
		const card = document.createElement('div');
		card.className = 'c--card-a js--dynamic';
		card.dataset.cursorText = String(cardCount).padStart(2, '0');
		card.textContent = `Card ${String(cardCount).padStart(2, '0')}`;
		grid.appendChild(card);
		newCards.push(card);
	}

	dot.addFocusElements({ elements: newCards, focusClass: 'c--cursor-a--fourth' });
	ring.addFocusElements({
		elements: newCards,
		focusClass: 'c--cursor-b--fourth',
		mouseenter: textEnterFn,
		mouseleave: textLeaveFn,
	});
});

// ─── 4. Disable / Enable toggle ────────────────────────
const toggleBtn = document.getElementById('js--toggle');
let isDisabled = false;

toggleBtn.addEventListener('click', () => {
	isDisabled = !isDisabled;
	if (isDisabled) {
		dot.disable();
		ring.disable();
		toggleBtn.textContent = 'Enable Cursor';
		toggleBtn.classList.add('c--btn-a--is-active');
	} else {
		dot.enable();
		ring.enable();
		toggleBtn.textContent = 'Disable Cursor';
		toggleBtn.classList.remove('c--btn-a--is-active');
	}
});

// ─── 5. Update options dynamically ─────────────────────
const updateBtn = document.getElementById('js--update');
let isLarge = false;

updateBtn.addEventListener('click', () => {
	isLarge = !isLarge;
	if (isLarge) {
		dot.update({ focusClass: 'c--cursor-a--third' });
		ring.update({ focusClass: 'c--cursor-b--third' });
		updateBtn.textContent = 'Revert Cursor';
		updateBtn.classList.add('c--btn-a--is-active');
	} else {
		dot.update({ focusClass: 'c--cursor-a--is-active' });
		ring.update({ focusClass: 'c--cursor-b--is-active' });
		updateBtn.textContent = 'Toggle Large Cursor';
		updateBtn.classList.remove('c--btn-a--is-active');
	}
});
