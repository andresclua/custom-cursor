/**
 * FocusController
 * Manages focus-element listeners (mouseenter/mouseleave) with proper cleanup.
 */
class FocusController {
	constructor(cursorEl) {
		this.cursorEl = cursorEl;
		this._entries = []; // { el, enterFunc, leaveFunc }
	}

	/**
	 * Register focus elements.
	 * @param {Array} focusOpts — array of strings (selectors) or objects:
	 *   string  → selector, uses default focusClass
	 *   object  → { elements: string|NodeList|Array, focusClass?, mouseenter?, mouseleave? }
	 * @param {string} defaultFocusClass — fallback class when only a selector string is provided
	 * @returns {this}
	 */
	addFocusElements(focusOpts, defaultFocusClass = 'cursor--focused') {
		if (!Array.isArray(focusOpts)) focusOpts = [focusOpts];

		focusOpts.forEach(opt => {
			let elements;
			let focusClass;
			let onEnter;
			let onLeave;

			if (typeof opt === 'string') {
				elements = document.querySelectorAll(opt);
				focusClass = defaultFocusClass;
			} else {
				const raw = opt.elements;
				if (typeof raw === 'string') {
					elements = document.querySelectorAll(raw);
				} else if (raw instanceof NodeList || Array.isArray(raw)) {
					elements = raw;
				} else {
					elements = [raw];
				}
				focusClass = opt.focusClass || defaultFocusClass;
				onEnter = opt.mouseenter;
				onLeave = opt.mouseleave;
			}

			Array.from(elements).forEach(el => {
				const enterFunc = () => {
					this.cursorEl.classList.add(focusClass);
					if (typeof onEnter === 'function') onEnter(this.cursorEl, el);
				};
				const leaveFunc = () => {
					this.cursorEl.classList.remove(focusClass);
					if (typeof onLeave === 'function') onLeave(this.cursorEl, el);
				};

				el.addEventListener('mouseenter', enterFunc);
				el.addEventListener('mouseleave', leaveFunc);
				this._entries.push({ el, enterFunc, leaveFunc });
			});
		});

		return this;
	}

	/**
	 * Remove listeners for specific elements.
	 * @param {string|NodeList|Array|Element} elements
	 * @returns {this}
	 */
	removeFocusElements(elements) {
		if (typeof elements === 'string') {
			elements = document.querySelectorAll(elements);
		} else if (!(elements instanceof NodeList) && !Array.isArray(elements)) {
			elements = [elements];
		}

		const toRemove = new Set(Array.from(elements));

		this._entries = this._entries.filter(entry => {
			if (toRemove.has(entry.el)) {
				entry.el.removeEventListener('mouseenter', entry.enterFunc);
				entry.el.removeEventListener('mouseleave', entry.leaveFunc);
				return false;
			}
			return true;
		});

		return this;
	}

	/**
	 * Remove all focus listeners.
	 * @returns {this}
	 */
	destroy() {
		this._entries.forEach(entry => {
			entry.el.removeEventListener('mouseenter', entry.enterFunc);
			entry.el.removeEventListener('mouseleave', entry.leaveFunc);
		});
		this._entries = [];
		return this;
	}
}

/**
 * CustomCursor
 * A lightweight custom cursor replacement.
 */
class CustomCursor {
	constructor(element, options = {}) {
		this.element = typeof element === 'string' ? document.querySelector(element) : element;
		if (!this.element) throw new Error('CustomCursor: no valid element provided');

		this.options = {
			hideTrueCursor: options.hideTrueCursor ?? false,
			focusElements: options.focusElements ?? ['a', 'button'],
			focusClass: options.focusClass ?? 'c--cursor-a--is-active',
			hiddenClass: options.hiddenClass ?? 'c--cursor-a--is-hidden',
			clickingClass: options.clickingClass ?? 'cursor--clicking',
			lerp: options.lerp ?? 1,
		};

		this.initialized = false;
		this.disabled = false;
		this.position = { x: null, y: null };
		this._current = { x: 0, y: 0 };
		this.styleTag = null;
		this._rafId = null;
		this._focusController = null;

		// Bind handlers
		this._onMouseMove = this._onMouseMove.bind(this);
		this._onMouseEnter = this._onMouseEnter.bind(this);
		this._onMouseLeave = this._onMouseLeave.bind(this);
		this._onMouseDown = this._onMouseDown.bind(this);
	}

	/**
	 * Initialize the custom cursor.
	 * @returns {this}
	 */
	initialize() {
		if (this.initialized || this._isMobile()) return this;

		this.element.classList.add('cursor--initialized');

		if (this.options.hideTrueCursor) this._hideTrueCursor();

		document.addEventListener('mousemove', this._onMouseMove);
		document.addEventListener('mouseenter', this._onMouseEnter);
		document.addEventListener('mouseleave', this._onMouseLeave);
		document.addEventListener('mousedown', this._onMouseDown);

		// Focus controller
		this._focusController = new FocusController(this.element);
		this._focusController.addFocusElements(this.options.focusElements, this.options.focusClass);

		// rAF loop
		const render = () => {
			if (!this.disabled && this.position.x !== null) {
				if (this.options.lerp >= 1) {
					this._current.x = this.position.x;
					this._current.y = this.position.y;
				} else {
					this._current.x += (this.position.x - this._current.x) * this.options.lerp;
					this._current.y += (this.position.y - this._current.y) * this.options.lerp;
				}
				this._setPosition(this._current.x, this._current.y);
			}
			this._rafId = requestAnimationFrame(render);
		};
		this._rafId = requestAnimationFrame(render);

		this.initialized = true;
		return this;
	}

	/**
	 * Destroy the cursor instance and clean up all resources.
	 * @returns {this}
	 */
	destroy() {
		if (!this.initialized) return this;

		// Cancel animation frame
		if (this._rafId !== null) {
			cancelAnimationFrame(this._rafId);
			this._rafId = null;
		}

		this.element.classList.remove('cursor--initialized', this.options.hiddenClass);
		this._unhideTrueCursor();

		document.removeEventListener('mousemove', this._onMouseMove);
		document.removeEventListener('mouseenter', this._onMouseEnter);
		document.removeEventListener('mouseleave', this._onMouseLeave);
		document.removeEventListener('mousedown', this._onMouseDown);

		if (this._focusController) {
			this._focusController.destroy();
			this._focusController = null;
		}

		this.initialized = false;
		return this;
	}

	/**
	 * Update options and re-initialize.
	 * @param {Object} newOptions
	 * @returns {this}
	 */
	update(newOptions) {
		this.destroy();
		Object.assign(this.options, newOptions);
		this.initialize();
		return this;
	}

	/**
	 * Add focus elements (proxy to FocusController).
	 * @param {Array|string|Object} focusOpts
	 * @returns {this}
	 */
	addFocusElements(focusOpts) {
		if (this._focusController) {
			this._focusController.addFocusElements(focusOpts, this.options.focusClass);
		}
		return this;
	}

	/**
	 * Remove focus elements (proxy to FocusController).
	 * @param {string|NodeList|Array|Element} elements
	 * @returns {this}
	 */
	removeFocusElements(elements) {
		if (this._focusController) {
			this._focusController.removeFocusElements(elements);
		}
		return this;
	}

	/**
	 * Disable the cursor.
	 * @returns {this}
	 */
	disable() {
		if (!this.initialized) return this;
		this.disabled = true;
		this.element.classList.add(this.options.hiddenClass);
		return this;
	}

	/**
	 * Enable the cursor.
	 * @returns {this}
	 */
	enable() {
		if (!this.initialized) return this;
		this.disabled = false;
		this.element.classList.remove(this.options.hiddenClass);
		return this;
	}

	// ─── Private ───────────────────────────────────────────

	_onMouseMove(e) {
		this.position.x = e.clientX;
		this.position.y = e.clientY;
	}

	_setPosition(x, y) {
		if (typeof x === 'number' && typeof y === 'number') {
			this.element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
		}
	}

	_onMouseEnter() {
		this.element.classList.remove(this.options.hiddenClass);
	}

	_onMouseLeave() {
		this.element.classList.add(this.options.hiddenClass);
	}

	_onMouseDown() {
		this.element.classList.add(this.options.clickingClass);
		document.addEventListener('mouseup', () => {
			this.element.classList.remove(this.options.clickingClass);
		}, { once: true });
	}

	_hideTrueCursor() {
		if (!this.styleTag) {
			this.styleTag = document.createElement('style');
			this.styleTag.textContent = '* { cursor: none !important; }';
			document.head.appendChild(this.styleTag);
		}
	}

	_unhideTrueCursor() {
		if (this.styleTag) {
			this.styleTag.remove();
			this.styleTag = null;
		}
	}

	_isMobile() {
		return /Mobi|Android/i.test(navigator.userAgent);
	}
}

export default CustomCursor;
