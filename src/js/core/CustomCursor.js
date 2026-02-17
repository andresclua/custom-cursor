/**
 * CustomCursor - A lightweight custom cursor replacement
 *
 * Creates a single custom cursor wrapper that manages N child items,
 * each with its own lerp interpolation (set via data-lerp attribute).
 * Supports focus elements with custom classes and callbacks, disable/enable toggling,
 * clicking states, off-screen detection, and enriched focusElements config.
 *
 * @class CustomCursor
 *
 * @param {Object} options - Configuration object
 * @param {HTMLElement|string} options.element - The cursor wrapper element or a selector string
 * @param {boolean} [options.hideTrueCursor=false] - Hide the native cursor
 * @param {boolean} [options.disableTouch=true] - Do not initialize on touch devices
 * @param {Array} [options.focusElements=['a','button']] - Selectors or objects for focus hover
 * @param {string} [options.focusClass='c--cursor-a--is-active'] - Default class added on focus-element hover
 * @param {string} [options.hiddenClass='c--cursor-a--is-hidden'] - Class added when cursor is hidden or off-screen
 * @param {string} [options.clickingClass='c--cursor-a--second'] - Class added during mousedown
 * @param {Function|null} [options.onInit=null] - Callback called after initialization, receives cursorEl
 * @param {Function|null} [options.onDestroy=null] - Callback called after destroy, receives cursorEl
 * @param {Function|null} [options.onMove=null] - Callback called on each frame with (position, cursorEl)
 *
 * @example
 * const cursor = new CustomCursor({
 *   element: '.c--cursor-a',
 *   hideTrueCursor: true,
 *   focusElements: [
 *     'a',
 *     'button',
 *     { elements: '.js--grow', focusClass: 'c--cursor-a--third' },
 *     {
 *       elements: '.js--text',
 *       focusClass: 'c--cursor-a--fourth',
 *       mouseenter(cursorEl, el) { },
 *       mouseleave(cursorEl, el) { },
 *     },
 *   ],
 * });
 */
class CustomCursor {
	constructor(options) {
		var { element, hideTrueCursor, disableTouch, focusElements, focusClass, hiddenClass, clickingClass, onInit, onDestroy, onMove } = options;

		this.DOM = {
			element: typeof element === 'string' ? document.querySelector(element) : element,
			styleTag: null,
		};

		if (!this.DOM.element) throw new Error('CustomCursor: no valid element provided');

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
		this.onMove = onMove ?? null;

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
	 * Update options without destroying the instance.
	 * Merges new values, unbinds old focus entries, and re-binds.
	 * @param {Object} newOptions - Partial options to override
	 * @returns {this}
	 */
	update(newOptions) {
		if (!this.initialized) return this;

		// Merge options
		this.hideTrueCursor = newOptions.hideTrueCursor ?? this.hideTrueCursor;
		this.disableTouch = newOptions.disableTouch ?? this.disableTouch;
		this.focusElements = newOptions.focusElements ?? this.focusElements;
		this.focusClass = newOptions.focusClass ?? this.focusClass;
		this.hiddenClass = newOptions.hiddenClass ?? this.hiddenClass;
		this.clickingClass = newOptions.clickingClass ?? this.clickingClass;
		this.onInit = newOptions.onInit ?? this.onInit;
		this.onDestroy = newOptions.onDestroy ?? this.onDestroy;
		this.onMove = newOptions.onMove ?? this.onMove;

		// Handle hideTrueCursor toggle
		if (this.hideTrueCursor) {
			this.#hideCursor();
		} else {
			this.#unhideCursor();
		}

		// Unbind old focus entries, re-bind with current config
		this.#unbindFocusElements();
		this.#bindFocusElements(this.focusElements);

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

		if (this.rafId !== null) {
			cancelAnimationFrame(this.rafId);
			this.rafId = null;
		}

		this.DOM.element.classList.remove('cursor--initialized', this.hiddenClass);
		this.#unhideCursor();

		document.removeEventListener('mousemove', this.onMouseMoveHandler);
		document.removeEventListener('mouseenter', this.onMouseEnterHandler);
		document.removeEventListener('mouseleave', this.onMouseLeaveHandler);
		document.removeEventListener('mousedown', this.onMouseDownHandler);

		this.#unbindFocusElements();

		if (typeof this.onDestroy === 'function') this.onDestroy(this.DOM.element);

		this.initialized = false;
	}

	// ─── Private ───────────────────────────────────────────

	/**
	 * Initializes the cursor, hides native cursor, processes focusElements,
	 * and starts the rAF render loop.
	 */
	#init() {
		if (this.initialized) return;

		this.DOM.element.classList.add('cursor--initialized');

		if (this.hideTrueCursor) this.#hideCursor();

		this.#bindFocusElements(this.focusElements);

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

				if (typeof this.onMove === 'function') this.onMove(this.position, this.DOM.element);
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

	/**
	 * Removes all current focus element listeners.
	 */
	#unbindFocusElements() {
		this.focusEntries.forEach(entry => {
			entry.el.removeEventListener('mouseenter', entry.enterHandler);
			entry.el.removeEventListener('mouseleave', entry.leaveHandler);
		});
		this.focusEntries = [];
	}

	/**
	 * Processes the focusElements array. Each entry can be a string selector
	 * or an object with { elements, focusClass?, mouseenter?, mouseleave? }.
	 * @param {Array} focusOpts
	 */
	#bindFocusElements(focusOpts) {
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
