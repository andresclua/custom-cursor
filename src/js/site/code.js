// Copy buttons for code blocks (.js--code-copy inside .c--code-a).
export function initCodeCopy() {
	document.querySelectorAll('.js--code-copy').forEach((btn) => {
		btn.addEventListener('click', () => {
			const code = btn.parentElement.querySelector('code').textContent;
			navigator.clipboard.writeText(code).then(() => {
				btn.textContent = 'Copied!';
				setTimeout(() => { btn.textContent = 'Copy'; }, 1400);
			});
		});
	});
}
