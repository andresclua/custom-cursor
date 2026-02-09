/**
 * CustomCursor - A lightweight custom cursor replacement
 *
 * Creates a single custom cursor wrapper that manages N child items,
 * each with its own lerp interpolation (set via data-lerp attribute).
 * Supports focus elements with custom classes and callbacks, disable/enable toggling,
 * clicking states, off-screen detection, and dynamic content via addFocusElements().
 *
 * @class CustomCursor
 *
 * @param {Object} payload - Configuration object
 * @param {HTMLElement|string} payload.element - The cursor wrapper element or a selector string
 * @param {boolean} [payload.hideTrueCursor=false] - Hide the native cursor
 * @param {boolean} [payload.disableTouch=true] - Do not initialize on touch devices
 * @param {string[]} [payload.focusElements=['a','button']] - Selectors for default focus hover
 * @param {string} [payload.focusClass='c--cursor-a--is-active'] - Class added on focus-element hover
 * @param {string} [payload.hiddenClass='c--cursor-a--is-hidden'] - Class added when cursor is hidden or off-screen
 * @param {string} [payload.clickingClass='c--cursor-a--second'] - Class added during mousedown
 * @param {Function|null} [payload.onInit=null] - Callback called after initialization, receives wrapperEl
 * @param {Function|null} [payload.onDestroy=null] - Callback called after destroy, receives wrapperEl
 *
 * @example
 * const cursor = new CustomCursor({
 *   element: '.c--cursor-a',
 *   hideTrueCursor: true,
 *   disableTouch: true,
 *   focusElements: ['a', 'button'],
 *   focusClass: 'c--cursor-a--is-active',
 *   hiddenClass: 'c--cursor-a--is-hidden',
 *   clickingClass: 'c--cursor-a--second',
 *   onInit: null,
 *   onDestroy: null,
 * });
 */
class CustomCursor {
	constructor(payload) {
		var { element, hideTrueCursor, disableTouch, focusElements, focusClass, hiddenClass, clickingClass, onInit, onDestroy } = payload;

		this.DOM = {
			element: typeof element === 'string' ? document.querySelector(element) : element,
			styleTag: null,
		};

		if (!this.DOM.element) throw new Error('CustomCursor: no valid element provided');

		// Auto-discover children with data-lerp attribute
		this.items = Array.from(this.DOM.element.querySelectorAll('[data-lerp]')).map(el => ({
			el,
			lerp: parseFloat(el.dataset.lerp) || 1,
			current: { x: 0, y: 0 },
		}));

		this.hideTrueCursor = hideTrueCursor ?? false;
		this.disableTouch = disableTouch ?? true;
		this.focusElements = focusElements ?? ['a', 'button'];
		this.focusClass = focusClass ?? 'c--cursor-a--is-active';
		this.hiddenClass = hiddenClass ?? 'c--cursor-a--is-hidden';
		this.clickingClass = clickingClass ?? 'c--cursor-a--second';
		this.onInit = onInit ?? null;
		this.onDestroy = onDestroy ?? null;

		this.initialized = false;
		this.disabled = false;
		this.position = { x: null, y: null };
		this.rafId = null;
		this.focusEntries = [];

		this.onMouseMoveHandler = this.#onMouseMove.bind(this);
		this.onMouseEnterHandler = this.#onMouseEnter.bind(this);
		this.onMouseLeaveHandler = this.#onMouseLeave.bind(this);
		this.onMouseDownHandler = this.#onMouseDown.bind(this);

		if (this.disableTouch && this.#isTouch()) return;

		this.#init();
		this.#events();
	}

	/**
	 * Register focus elements dynamically.
	 * @param {Array|string|Object} focusOpts - Selector string, array of selectors, or object with { elements, focusClass?, mouseenter?, mouseleave? }
	 * @returns {this}
	 */
	addFocusElements(focusOpts) {
		if (!Array.isArray(focusOpts)) focusOpts = [focusOpts];

		focusOpts.forEach(opt => {
			var elements, optFocusClass, onEnter, onLeave;

			if (typeof opt === 'string') {
				elements = document.querySelectorAll(opt);
				optFocusClass = this.focusClass;
			} else {
				var raw = opt.elements;
				if (typeof raw === 'string') {
					elements = document.querySelectorAll(raw);
				} else if (raw instanceof NodeList || Array.isArray(raw)) {
					elements = raw;
				} else {
					elements = [raw];
				}
				optFocusClass = opt.focusClass || this.focusClass;
				onEnter = opt.mouseenter;
				onLeave = opt.mouseleave;
			}

			Array.from(elements).forEach(el => {
				var enterHandler = () => {
					this.DOM.element.classList.add(optFocusClass);
					if (typeof onEnter === 'function') onEnter(this.DOM.element, el);
				};
				var leaveHandler = () => {
					this.DOM.element.classList.remove(optFocusClass);
					if (typeof onLeave === 'function') onLeave(this.DOM.element, el);
				};

				el.addEventListener('mouseenter', enterHandler);
				el.addEventListener('mouseleave', leaveHandler);
				this.focusEntries.push({ el, enterHandler, leaveHandler });
			});
		});

		return this;
	}

	/**
	 * Remove focus listeners for specific elements.
	 * @param {string|NodeList|Array|Element} elements
	 * @returns {this}
	 */
	removeFocusElements(elements) {
		if (typeof elements === 'string') {
			elements = document.querySelectorAll(elements);
		} else if (!(elements instanceof NodeList) && !Array.isArray(elements)) {
			elements = [elements];
		}

		var toRemove = new Set(Array.from(elements));

		this.focusEntries = this.focusEntries.filter(entry => {
			if (toRemove.has(entry.el)) {
				entry.el.removeEventListener('mouseenter', entry.enterHandler);
				entry.el.removeEventListener('mouseleave', entry.leaveHandler);
				return false;
			}
			return true;
		});

		return this;
	}

	/**
	 * Update options and re-initialize.
	 * @param {Object} newOptions - Partial payload with options to override
	 * @returns {this}
	 */
	update(newOptions) {
		this.destroy();
		Object.assign(this, {
			hideTrueCursor: newOptions.hideTrueCursor ?? this.hideTrueCursor,
			disableTouch: newOptions.disableTouch ?? this.disableTouch,
			focusElements: newOptions.focusElements ?? this.focusElements,
			focusClass: newOptions.focusClass ?? this.focusClass,
			hiddenClass: newOptions.hiddenClass ?? this.hiddenClass,
			clickingClass: newOptions.clickingClass ?? this.clickingClass,
			onInit: newOptions.onInit ?? this.onInit,
			onDestroy: newOptions.onDestroy ?? this.onDestroy,
		});
		this.#init();
		this.#events();
		return this;
	}

	/**
	 * Disable the cursor.
	 * @returns {this}
	 */
	disable() {
		if (!this.initialized) return this;
		this.disabled = true;
		this.DOM.element.classList.add(this.hiddenClass);
		return this;
	}

	/**
	 * Enable the cursor.
	 * @returns {this}
	 */
	enable() {
		if (!this.initialized) return this;
		this.disabled = false;
		this.DOM.element.classList.remove(this.hiddenClass);
		return this;
	}

	/**
	 * Removes all event listeners, cancels rAF, and clears all references.
	 */
	destroy() {
		if (!this.initialized) return;

		// Cancel animation frame
		if (this.rafId !== null) {
			cancelAnimationFrame(this.rafId);
			this.rafId = null;
		}

		// Remove classes
		this.DOM.element.classList.remove('cursor--initialized', this.hiddenClass);
		this.#unhideCursor();

		// Remove document event listeners
		document.removeEventListener('mousemove', this.onMouseMoveHandler);
		document.removeEventListener('mouseenter', this.onMouseEnterHandler);
		document.removeEventListener('mouseleave', this.onMouseLeaveHandler);
		document.removeEventListener('mousedown', this.onMouseDownHandler);

		// Remove all focus listeners
		this.focusEntries.forEach(entry => {
			entry.el.removeEventListener('mouseenter', entry.enterHandler);
			entry.el.removeEventListener('mouseleave', entry.leaveHandler);
		});
		this.focusEntries = [];

		if (typeof this.onDestroy === 'function') this.onDestroy(this.DOM.element);

		this.initialized = false;
	}

	// ─── Private ───────────────────────────────────────────

	/**
	 * Initializes the cursor, hides native cursor, registers default
	 * focus elements and starts the rAF render loop.
	 */
	#init() {
		if (this.initialized) return;

		this.DOM.element.classList.add('cursor--initialized');

		if (this.hideTrueCursor) this.#hideCursor();

		this.addFocusElements(this.focusElements);

		const render = () => {
			if (!this.disabled && this.position.x !== null) {
				this.items.forEach(item => {
					if (item.lerp >= 1) {
						item.current.x = this.position.x;
						item.current.y = this.position.y;
					} else {
						item.current.x += (this.position.x - item.current.x) * item.lerp;
						item.current.y += (this.position.y - item.current.y) * item.lerp;
					}
					item.el.style.transform = `translate3d(${item.current.x}px, ${item.current.y}px, 0)`;
				});
			}
			this.rafId = requestAnimationFrame(render);
		};
		this.rafId = requestAnimationFrame(render);

		this.initialized = true;

		if (typeof this.onInit === 'function') this.onInit(this.DOM.element);
	}

	/**
	 * Sets up document-level event listeners for mouse tracking,
	 * enter/leave detection and click state.
	 */
	#events() {
		document.addEventListener('mousemove', this.onMouseMoveHandler);
		document.addEventListener('mouseenter', this.onMouseEnterHandler);
		document.addEventListener('mouseleave', this.onMouseLeaveHandler);
		document.addEventListener('mousedown', this.onMouseDownHandler);
	}

	#onMouseMove(e) {
		this.position.x = e.clientX;
		this.position.y = e.clientY;
	}

	#onMouseEnter() {
		this.DOM.element.classList.remove(this.hiddenClass);
	}

	#onMouseLeave() {
		this.DOM.element.classList.add(this.hiddenClass);
	}

	#onMouseDown() {
		this.DOM.element.classList.add(this.clickingClass);
		document.addEventListener('mouseup', () => {
			this.DOM.element.classList.remove(this.clickingClass);
		}, { once: true });
	}

	#hideCursor() {
		if (!this.DOM.styleTag) {
			this.DOM.styleTag = document.createElement('style');
			this.DOM.styleTag.textContent = '* { cursor: none !important; }';
			document.head.appendChild(this.DOM.styleTag);
		}
	}

	#unhideCursor() {
		if (this.DOM.styleTag) {
			this.DOM.styleTag.remove();
			this.DOM.styleTag = null;
		}
	}

	#isTouch() {
		return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
	}
}

export default CustomCursor;
