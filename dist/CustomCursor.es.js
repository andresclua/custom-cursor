class c {
  constructor(e) {
    this.cursorEl = e, this._entries = [];
  }
  /**
   * Register focus elements.
   * @param {Array} focusOpts — array of strings (selectors) or objects:
   *   string  → selector, uses default focusClass
   *   object  → { elements: string|NodeList|Array, focusClass?, mouseenter?, mouseleave? }
   * @param {string} defaultFocusClass — fallback class when only a selector string is provided
   * @returns {this}
   */
  addFocusElements(e, s = "cursor--focused") {
    return Array.isArray(e) || (e = [e]), e.forEach((t) => {
      let o, n, r, l;
      if (typeof t == "string")
        o = document.querySelectorAll(t), n = s;
      else {
        const i = t.elements;
        typeof i == "string" ? o = document.querySelectorAll(i) : i instanceof NodeList || Array.isArray(i) ? o = i : o = [i], n = t.focusClass || s, r = t.mouseenter, l = t.mouseleave;
      }
      Array.from(o).forEach((i) => {
        const u = () => {
          this.cursorEl.classList.add(n), typeof r == "function" && r(this.cursorEl, i);
        }, h = () => {
          this.cursorEl.classList.remove(n), typeof l == "function" && l(this.cursorEl, i);
        };
        i.addEventListener("mouseenter", u), i.addEventListener("mouseleave", h), this._entries.push({ el: i, enterFunc: u, leaveFunc: h });
      });
    }), this;
  }
  /**
   * Remove listeners for specific elements.
   * @param {string|NodeList|Array|Element} elements
   * @returns {this}
   */
  removeFocusElements(e) {
    typeof e == "string" ? e = document.querySelectorAll(e) : !(e instanceof NodeList) && !Array.isArray(e) && (e = [e]);
    const s = new Set(Array.from(e));
    return this._entries = this._entries.filter((t) => s.has(t.el) ? (t.el.removeEventListener("mouseenter", t.enterFunc), t.el.removeEventListener("mouseleave", t.leaveFunc), !1) : !0), this;
  }
  /**
   * Remove all focus listeners.
   * @returns {this}
   */
  destroy() {
    return this._entries.forEach((e) => {
      e.el.removeEventListener("mouseenter", e.enterFunc), e.el.removeEventListener("mouseleave", e.leaveFunc);
    }), this._entries = [], this;
  }
}
class d {
  constructor(e, s = {}) {
    if (this.element = typeof e == "string" ? document.querySelector(e) : e, !this.element) throw new Error("CustomCursor: no valid element provided");
    this.options = {
      hideTrueCursor: s.hideTrueCursor ?? !1,
      focusElements: s.focusElements ?? ["a", "button"],
      focusClass: s.focusClass ?? "c--cursor-a--is-active",
      hiddenClass: s.hiddenClass ?? "c--cursor-a--is-hidden",
      clickingClass: s.clickingClass ?? "cursor--clicking",
      lerp: s.lerp ?? 1
    }, this.initialized = !1, this.disabled = !1, this.position = { x: null, y: null }, this._current = { x: 0, y: 0 }, this.styleTag = null, this._rafId = null, this._focusController = null, this._onMouseMove = this._onMouseMove.bind(this), this._onMouseEnter = this._onMouseEnter.bind(this), this._onMouseLeave = this._onMouseLeave.bind(this), this._onMouseDown = this._onMouseDown.bind(this);
  }
  /**
   * Initialize the custom cursor.
   * @returns {this}
   */
  initialize() {
    if (this.initialized || this._isMobile()) return this;
    this.element.classList.add("cursor--initialized"), this.options.hideTrueCursor && this._hideTrueCursor(), document.addEventListener("mousemove", this._onMouseMove), document.addEventListener("mouseenter", this._onMouseEnter), document.addEventListener("mouseleave", this._onMouseLeave), document.addEventListener("mousedown", this._onMouseDown), this._focusController = new c(this.element), this._focusController.addFocusElements(this.options.focusElements, this.options.focusClass);
    const e = () => {
      !this.disabled && this.position.x !== null && (this.options.lerp >= 1 ? (this._current.x = this.position.x, this._current.y = this.position.y) : (this._current.x += (this.position.x - this._current.x) * this.options.lerp, this._current.y += (this.position.y - this._current.y) * this.options.lerp), this._setPosition(this._current.x, this._current.y)), this._rafId = requestAnimationFrame(e);
    };
    return this._rafId = requestAnimationFrame(e), this.initialized = !0, this;
  }
  /**
   * Destroy the cursor instance and clean up all resources.
   * @returns {this}
   */
  destroy() {
    return this.initialized ? (this._rafId !== null && (cancelAnimationFrame(this._rafId), this._rafId = null), this.element.classList.remove("cursor--initialized", this.options.hiddenClass), this._unhideTrueCursor(), document.removeEventListener("mousemove", this._onMouseMove), document.removeEventListener("mouseenter", this._onMouseEnter), document.removeEventListener("mouseleave", this._onMouseLeave), document.removeEventListener("mousedown", this._onMouseDown), this._focusController && (this._focusController.destroy(), this._focusController = null), this.initialized = !1, this) : this;
  }
  /**
   * Update options and re-initialize.
   * @param {Object} newOptions
   * @returns {this}
   */
  update(e) {
    return this.destroy(), Object.assign(this.options, e), this.initialize(), this;
  }
  /**
   * Add focus elements (proxy to FocusController).
   * @param {Array|string|Object} focusOpts
   * @returns {this}
   */
  addFocusElements(e) {
    return this._focusController && this._focusController.addFocusElements(e, this.options.focusClass), this;
  }
  /**
   * Remove focus elements (proxy to FocusController).
   * @param {string|NodeList|Array|Element} elements
   * @returns {this}
   */
  removeFocusElements(e) {
    return this._focusController && this._focusController.removeFocusElements(e), this;
  }
  /**
   * Disable the cursor.
   * @returns {this}
   */
  disable() {
    return this.initialized ? (this.disabled = !0, this.element.classList.add(this.options.hiddenClass), this) : this;
  }
  /**
   * Enable the cursor.
   * @returns {this}
   */
  enable() {
    return this.initialized ? (this.disabled = !1, this.element.classList.remove(this.options.hiddenClass), this) : this;
  }
  // ─── Private ───────────────────────────────────────────
  _onMouseMove(e) {
    this.position.x = e.clientX, this.position.y = e.clientY;
  }
  _setPosition(e, s) {
    typeof e == "number" && typeof s == "number" && (this.element.style.transform = `translate3d(${e}px, ${s}px, 0)`);
  }
  _onMouseEnter() {
    this.element.classList.remove(this.options.hiddenClass);
  }
  _onMouseLeave() {
    this.element.classList.add(this.options.hiddenClass);
  }
  _onMouseDown() {
    this.element.classList.add(this.options.clickingClass), document.addEventListener("mouseup", () => {
      this.element.classList.remove(this.options.clickingClass);
    }, { once: !0 });
  }
  _hideTrueCursor() {
    this.styleTag || (this.styleTag = document.createElement("style"), this.styleTag.textContent = "* { cursor: none !important; }", document.head.appendChild(this.styleTag));
  }
  _unhideTrueCursor() {
    this.styleTag && (this.styleTag.remove(), this.styleTag = null);
  }
  _isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent);
  }
}
export {
  d as default
};
