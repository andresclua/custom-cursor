export function initFinal() {
	document.querySelectorAll('.js--copy').forEach((el) => {
		el.addEventListener('click', () => {
			navigator.clipboard.writeText(el.dataset.copy).then(() => {
				const text = el.querySelector('.c--install-a__content');
				const orig = text.textContent;
				el.classList.add('c--install-a--is-active');
				text.textContent = 'Copied!';
				setTimeout(() => { el.classList.remove('c--install-a--is-active'); text.textContent = orig; }, 1600);
			});
		});
	});
}
