var D = (n) => {
  throw TypeError(n);
};
var I = (n, e, s) => e.has(n) || D("Cannot " + s);
var E = (n, e, s) => e.has(n) ? D("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(n) : e.set(n, s);
var i = (n, e, s) => (I(n, e, "access private method"), s);
var t, L, p, f, v, T, b, g, H, x, M, C, O;
class z {
  constructor(e) {
    E(this, t);
    var { element: s, hideTrueCursor: o, disableTouch: l, focusElements: a, focusClass: u, hiddenClass: h, clickingClass: r, onInit: d, onDestroy: c, onMove: m } = e;
    if (this.DOM = {
      element: typeof s == "string" ? document.querySelector(s) : s,
      styleTag: null
    }, !this.DOM.element) throw new Error("CustomCursor: no valid element provided");
    this.items = Array.from(this.DOM.element.querySelectorAll("[data-lerp]")).map((y) => ({
      el: y,
      lerp: parseFloat(y.dataset.lerp) || 1,
      current: { x: 0, y: 0 }
    })), this.hideTrueCursor = o ?? !1, this.disableTouch = l ?? !0, this.focusElements = a ?? ["a", "button"], this.focusClass = u ?? "c--cursor-a--is-active", this.hiddenClass = h ?? "c--cursor-a--is-hidden", this.clickingClass = r ?? "c--cursor-a--second", this.onInit = d ?? null, this.onDestroy = c ?? null, this.onMove = m ?? null, this.initialized = !1, this.disabled = !1, this.position = { x: null, y: null }, this.rafId = null, this.focusEntries = [], this.onMouseMoveHandler = i(this, t, T).bind(this), this.onMouseEnterHandler = i(this, t, b).bind(this), this.onMouseLeaveHandler = i(this, t, g).bind(this), this.onMouseDownHandler = i(this, t, H).bind(this), this.onMouseUpHandler = i(this, t, x).bind(this), !(this.disableTouch && i(this, t, O).call(this)) && (i(this, t, L).call(this), i(this, t, p).call(this));
  }
  /**
   * Update options without destroying the instance.
   * Merges new values, unbinds old focus entries, and re-binds.
   * @param {Object} newOptions - Partial options to override
   * @returns {this}
   */
  update(e) {
    return this.initialized ? (this.hideTrueCursor = e.hideTrueCursor ?? this.hideTrueCursor, this.disableTouch = e.disableTouch ?? this.disableTouch, this.focusElements = e.focusElements ?? this.focusElements, this.focusClass = e.focusClass ?? this.focusClass, this.hiddenClass = e.hiddenClass ?? this.hiddenClass, this.clickingClass = e.clickingClass ?? this.clickingClass, this.onInit = e.onInit ?? this.onInit, this.onDestroy = e.onDestroy ?? this.onDestroy, this.onMove = e.onMove ?? this.onMove, this.hideTrueCursor ? i(this, t, M).call(this) : i(this, t, C).call(this), i(this, t, f).call(this), i(this, t, v).call(this, this.focusElements), this) : this;
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
    return this.initialized ? (this.disabled = !1, this.position.x !== null && this.DOM.element.classList.remove(this.hiddenClass), this) : this;
  }
  /**
   * Removes all event listeners, cancels rAF, and clears all references.
   */
  destroy() {
    this.initialized && (this.rafId !== null && (cancelAnimationFrame(this.rafId), this.rafId = null), this.DOM.element.classList.remove("cursor--initialized", this.hiddenClass), i(this, t, C).call(this), document.removeEventListener("mousemove", this.onMouseMoveHandler), document.removeEventListener("mouseenter", this.onMouseEnterHandler), document.removeEventListener("mouseleave", this.onMouseLeaveHandler), document.removeEventListener("mousedown", this.onMouseDownHandler), document.removeEventListener("mouseup", this.onMouseUpHandler), i(this, t, f).call(this), typeof this.onDestroy == "function" && this.onDestroy(this.DOM.element), this.initialized = !1);
  }
}
t = new WeakSet(), // ─── Private ───────────────────────────────────────────
/**
 * Initializes the cursor, hides native cursor, processes focusElements,
 * and starts the rAF render loop.
 */
L = function() {
  if (this.initialized) return;
  this.DOM.element.classList.add("cursor--initialized", this.hiddenClass), this.hideTrueCursor && i(this, t, M).call(this), i(this, t, v).call(this, this.focusElements);
  const e = () => {
    !this.disabled && this.position.x !== null && (this.items.forEach((s) => {
      s.lerp >= 1 ? (s.current.x = this.position.x, s.current.y = this.position.y) : (s.current.x += (this.position.x - s.current.x) * s.lerp, s.current.y += (this.position.y - s.current.y) * s.lerp), s.el.style.transform = `translate3d(${s.current.x}px, ${s.current.y}px, 0)`;
    }), typeof this.onMove == "function" && this.onMove(this.position, this.DOM.element)), this.rafId = requestAnimationFrame(e);
  };
  this.rafId = requestAnimationFrame(e), this.initialized = !0, typeof this.onInit == "function" && this.onInit(this.DOM.element);
}, /**
 * Sets up document-level event listeners for mouse tracking,
 * enter/leave detection and click state.
 */
p = function() {
  document.addEventListener("mousemove", this.onMouseMoveHandler), document.addEventListener("mouseenter", this.onMouseEnterHandler), document.addEventListener("mouseleave", this.onMouseLeaveHandler), document.addEventListener("mousedown", this.onMouseDownHandler), document.addEventListener("mouseup", this.onMouseUpHandler);
}, /**
 * Removes all current focus element listeners.
 */
f = function() {
  this.focusEntries.forEach((e) => {
    var s, o;
    (o = (s = e.el).matches) != null && o.call(s, ":hover") && this.DOM.element.classList.remove(e.cls), e.el.removeEventListener("mouseenter", e.enterHandler), e.el.removeEventListener("mouseleave", e.leaveHandler);
  }), this.focusEntries = [];
}, /**
 * Processes the focusElements array. Each entry can be a string selector
 * or an object with { elements, focusClass?, mouseenter?, mouseleave? }.
 * @param {Array} focusOpts
 */
v = function(e) {
  Array.isArray(e) || (e = [e]), e.forEach((s) => {
    var o, l, a, u;
    if (typeof s == "string")
      o = document.querySelectorAll(s), l = this.focusClass;
    else {
      var h = s.elements;
      typeof h == "string" ? o = document.querySelectorAll(h) : h instanceof NodeList || Array.isArray(h) ? o = h : o = [h], l = s.focusClass || this.focusClass, a = s.mouseenter, u = s.mouseleave;
    }
    Array.from(o).forEach((r) => {
      var m;
      var d = () => {
        this.DOM.element.classList.add(l), typeof a == "function" && a(this.DOM.element, r);
      }, c = () => {
        this.DOM.element.classList.remove(l), typeof u == "function" && u(this.DOM.element, r);
      };
      r.addEventListener("mouseenter", d), r.addEventListener("mouseleave", c), this.focusEntries.push({ el: r, enterHandler: d, leaveHandler: c, cls: l }), (m = r.matches) != null && m.call(r, ":hover") && this.DOM.element.classList.add(l);
    });
  });
}, T = function(e) {
  this.position.x === null && !this.disabled && this.DOM.element.classList.remove(this.hiddenClass), this.position.x = e.clientX, this.position.y = e.clientY;
}, b = function() {
  this.position.x === null || this.disabled || this.DOM.element.classList.remove(this.hiddenClass);
}, g = function() {
  this.DOM.element.classList.add(this.hiddenClass);
}, H = function() {
  this.DOM.element.classList.add(this.clickingClass);
}, x = function() {
  this.DOM.element.classList.remove(this.clickingClass);
}, M = function() {
  this.DOM.styleTag || (this.DOM.styleTag = document.createElement("style"), this.DOM.styleTag.textContent = "* { cursor: none !important; }", document.head.appendChild(this.DOM.styleTag));
}, C = function() {
  this.DOM.styleTag && (this.DOM.styleTag.remove(), this.DOM.styleTag = null);
}, O = function() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
};
export {
  z as default
};
