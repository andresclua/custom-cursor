/** Copy text to the clipboard and flash the button label. */
export function copyText(text, btn, done = 'Copied!') {
	return navigator.clipboard.writeText(text).then(() => {
		const orig = btn.dataset.label || btn.textContent;
		btn.dataset.label = orig;
		btn.textContent = done;
		setTimeout(() => { btn.textContent = orig; }, 1400);
	});
}

// Copy buttons for code blocks (.js--code-copy inside .c--code-a).
export function initCodeCopy() {
	document.querySelectorAll('.js--code-copy').forEach((btn) => {
		btn.addEventListener('click', () => copyText(btn.parentElement.querySelector('code').textContent, btn));
	});
}
