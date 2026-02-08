var m = (n) => {
  throw TypeError(n);
};
var g = (n, e, s) => e.has(n) || m("Cannot " + s);
var f = (n, e, s) => e.has(n) ? m("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(n) : e.set(n, s);
var o = (n, e, s) => (g(n, e, "access private method"), s);
var t, v, M, C, E, y, L, D;
class H {
  constructor(e) {
    f(this, t);
    var { element: s, hideTrueCursor: i, focusElements: a, focusClass: h, hiddenClass: u, clickingClass: r, lerp: l } = e;
    if (this.DOM = {
      element: typeof s == "string" ? document.querySelector(s) : s,
      styleTag: null
    }, !this.DOM.element) throw new Error("CustomCursor: no valid element provided");
    this.hideTrueCursor = i ?? !1, this.focusElements = a ?? ["a", "button"], this.focusClass = h ?? "c--cursor-a--is-active", this.hiddenClass = u ?? "c--cursor-a--is-hidden", this.clickingClass = r ?? "c--cursor-a--second", this.lerp = l ?? 1, this.initialized = !1, this.disabled = !1, this.position = { x: null, y: null }, this.current = { x: 0, y: 0 }, this.rafId = null, this.focusEntries = [], this.onMouseMoveHandler = o(this, t, v).bind(this), this.onMouseEnterHandler = o(this, t, M).bind(this), this.onMouseLeaveHandler = o(this, t, C).bind(this), this.onMouseDownHandler = o(this, t, E).bind(this), this.init(), this.events();
  }
  /**
   * Initializes the cursor, hides native cursor, registers default
   * focus elements and starts the rAF render loop.
   */
  init() {
    if (this.initialized || o(this, t, D).call(this)) return;
    this.DOM.element.classList.add("cursor--initialized"), this.hideTrueCursor && o(this, t, y).call(this), this.addFocusElements(this.focusElements);
    const e = () => {
      !this.disabled && this.position.x !== null && (this.lerp >= 1 ? (this.current.x = this.position.x, this.current.y = this.position.y) : (this.current.x += (this.position.x - this.current.x) * this.lerp, this.current.y += (this.position.y - this.current.y) * this.lerp), this.DOM.element.style.transform = `translate3d(${this.current.x}px, ${this.current.y}px, 0)`), this.rafId = requestAnimationFrame(e);
    };
    this.rafId = requestAnimationFrame(e), this.initialized = !0;
  }
  /**
   * Sets up document-level event listeners for mouse tracking,
   * enter/leave detection and click state.
   */
  events() {
    document.addEventListener("mousemove", this.onMouseMoveHandler), document.addEventListener("mouseenter", this.onMouseEnterHandler), document.addEventListener("mouseleave", this.onMouseLeaveHandler), document.addEventListener("mousedown", this.onMouseDownHandler);
  }
  /**
   * Register focus elements dynamically.
   * @param {Array|string|Object} focusOpts - Selector string, array of selectors, or object with { elements, focusClass?, mouseenter?, mouseleave? }
   * @returns {this}
   */
  addFocusElements(e) {
    return Array.isArray(e) || (e = [e]), e.forEach((s) => {
      var i, a, h, u;
      if (typeof s == "string")
        i = document.querySelectorAll(s), a = this.focusClass;
      else {
        var r = s.elements;
        typeof r == "string" ? i = document.querySelectorAll(r) : r instanceof NodeList || Array.isArray(r) ? i = r : i = [r], a = s.focusClass || this.focusClass, h = s.mouseenter, u = s.mouseleave;
      }
      Array.from(i).forEach((l) => {
        var d = () => {
          this.DOM.element.classList.add(a), typeof h == "function" && h(this.DOM.element, l);
        }, c = () => {
          this.DOM.element.classList.remove(a), typeof u == "function" && u(this.DOM.element, l);
        };
        l.addEventListener("mouseenter", d), l.addEventListener("mouseleave", c), this.focusEntries.push({ el: l, enterHandler: d, leaveHandler: c });
      });
    }), this;
  }
  /**
   * Remove focus listeners for specific elements.
   * @param {string|NodeList|Array|Element} elements
   * @returns {this}
   */
  removeFocusElements(e) {
    typeof e == "string" ? e = document.querySelectorAll(e) : !(e instanceof NodeList) && !Array.isArray(e) && (e = [e]);
    var s = new Set(Array.from(e));
    return this.focusEntries = this.focusEntries.filter((i) => s.has(i.el) ? (i.el.removeEventListener("mouseenter", i.enterHandler), i.el.removeEventListener("mouseleave", i.leaveHandler), !1) : !0), this;
  }
  /**
   * Update options and re-initialize.
   * @param {Object} newOptions - Partial payload with options to override
   * @returns {this}
   */
  update(e) {
    return this.destroy(), Object.assign(this, {
      hideTrueCursor: e.hideTrueCursor ?? this.hideTrueCursor,
      focusElements: e.focusElements ?? this.focusElements,
      focusClass: e.focusClass ?? this.focusClass,
      hiddenClass: e.hiddenClass ?? this.hiddenClass,
      clickingClass: e.clickingClass ?? this.clickingClass,
      lerp: e.lerp ?? this.lerp
    }), this.init(), this.events(), this;
  }
  /**
   * Disable the cursor.
   * @returns {this}
   */
  disable() {
    return this.initialized ? (this.disabled = !0, this.DOM.element.classList.add(this.hiddenClass), this) : this;
  }
  /**
   * Enable the cursor.
   * @returns {this}
   */
  enable() {
    return this.initialized ? (this.disabled = !1, this.DOM.element.classList.remove(this.hiddenClass), this) : this;
  }
  /**
   * Removes all event listeners, cancels rAF, and clears all references.
   */
  destroy() {
    this.initialized && (this.rafId !== null && (cancelAnimationFrame(this.rafId), this.rafId = null), this.DOM.element.classList.remove("cursor--initialized", this.hiddenClass), o(this, t, L).call(this), document.removeEventListener("mousemove", this.onMouseMoveHandler), document.removeEventListener("mouseenter", this.onMouseEnterHandler), document.removeEventListener("mouseleave", this.onMouseLeaveHandler), document.removeEventListener("mousedown", this.onMouseDownHandler), this.focusEntries.forEach((e) => {
      e.el.removeEventListener("mouseenter", e.enterHandler), e.el.removeEventListener("mouseleave", e.leaveHandler);
    }), this.focusEntries = [], this.initialized = !1);
  }
}
t = new WeakSet(), // ─── Private ───────────────────────────────────────────
v = function(e) {
  this.position.x = e.clientX, this.position.y = e.clientY;
}, M = function() {
  this.DOM.element.classList.remove(this.hiddenClass);
}, C = function() {
  this.DOM.element.classList.add(this.hiddenClass);
}, E = function() {
  this.DOM.element.classList.add(this.clickingClass), document.addEventListener("mouseup", () => {
    this.DOM.element.classList.remove(this.clickingClass);
  }, { once: !0 });
}, y = function() {
  this.DOM.styleTag || (this.DOM.styleTag = document.createElement("style"), this.DOM.styleTag.textContent = "* { cursor: none !important; }", document.head.appendChild(this.DOM.styleTag));
}, L = function() {
  this.DOM.styleTag && (this.DOM.styleTag.remove(), this.DOM.styleTag = null);
}, D = function() {
  return /Mobi|Android/i.test(navigator.userAgent);
};
export {
  H as default
};
