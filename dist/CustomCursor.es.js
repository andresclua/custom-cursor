var C = (n) => {
  throw TypeError(n);
};
var O = (n, e, s) => e.has(n) || C("Cannot " + s);
var E = (n, e, s) => e.has(n) ? C("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(n) : e.set(n, s);
var i = (n, e, s) => (O(n, e, "access private method"), s);
var t, D, L, m, f, T, p, b, g, v, M, H;
class A {
  constructor(e) {
    E(this, t);
    var { element: s, hideTrueCursor: r, disableTouch: h, focusElements: a, focusClass: u, hiddenClass: o, clickingClass: l, onInit: d, onDestroy: c, onMove: x } = e;
    if (this.DOM = {
      element: typeof s == "string" ? document.querySelector(s) : s,
      styleTag: null
    }, !this.DOM.element) throw new Error("CustomCursor: no valid element provided");
    this.items = Array.from(this.DOM.element.querySelectorAll("[data-lerp]")).map((y) => ({
      el: y,
      lerp: parseFloat(y.dataset.lerp) || 1,
      current: { x: 0, y: 0 }
    })), this.hideTrueCursor = r ?? !1, this.disableTouch = h ?? !0, this.focusElements = a ?? ["a", "button"], this.focusClass = u ?? "c--cursor-a--is-active", this.hiddenClass = o ?? "c--cursor-a--is-hidden", this.clickingClass = l ?? "c--cursor-a--second", this.onInit = d ?? null, this.onDestroy = c ?? null, this.onMove = x ?? null, this.initialized = !1, this.disabled = !1, this.position = { x: null, y: null }, this.rafId = null, this.focusEntries = [], this.onMouseMoveHandler = i(this, t, T).bind(this), this.onMouseEnterHandler = i(this, t, p).bind(this), this.onMouseLeaveHandler = i(this, t, b).bind(this), this.onMouseDownHandler = i(this, t, g).bind(this), !(this.disableTouch && i(this, t, H).call(this)) && (i(this, t, D).call(this), i(this, t, L).call(this));
  }
  /**
   * Update options without destroying the instance.
   * Merges new values, unbinds old focus entries, and re-binds.
   * @param {Object} newOptions - Partial options to override
   * @returns {this}
   */
  update(e) {
    return this.initialized ? (this.hideTrueCursor = e.hideTrueCursor ?? this.hideTrueCursor, this.disableTouch = e.disableTouch ?? this.disableTouch, this.focusElements = e.focusElements ?? this.focusElements, this.focusClass = e.focusClass ?? this.focusClass, this.hiddenClass = e.hiddenClass ?? this.hiddenClass, this.clickingClass = e.clickingClass ?? this.clickingClass, this.onInit = e.onInit ?? this.onInit, this.onDestroy = e.onDestroy ?? this.onDestroy, this.onMove = e.onMove ?? this.onMove, this.hideTrueCursor ? i(this, t, v).call(this) : i(this, t, M).call(this), i(this, t, m).call(this), i(this, t, f).call(this, this.focusElements), this) : this;
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
    this.initialized && (this.rafId !== null && (cancelAnimationFrame(this.rafId), this.rafId = null), this.DOM.element.classList.remove("cursor--initialized", this.hiddenClass), i(this, t, M).call(this), document.removeEventListener("mousemove", this.onMouseMoveHandler), document.removeEventListener("mouseenter", this.onMouseEnterHandler), document.removeEventListener("mouseleave", this.onMouseLeaveHandler), document.removeEventListener("mousedown", this.onMouseDownHandler), i(this, t, m).call(this), typeof this.onDestroy == "function" && this.onDestroy(this.DOM.element), this.initialized = !1);
  }
}
t = new WeakSet(), // ─── Private ───────────────────────────────────────────
/**
 * Initializes the cursor, hides native cursor, processes focusElements,
 * and starts the rAF render loop.
 */
D = function() {
  if (this.initialized) return;
  this.DOM.element.classList.add("cursor--initialized"), this.hideTrueCursor && i(this, t, v).call(this), i(this, t, f).call(this, this.focusElements);
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
L = function() {
  document.addEventListener("mousemove", this.onMouseMoveHandler), document.addEventListener("mouseenter", this.onMouseEnterHandler), document.addEventListener("mouseleave", this.onMouseLeaveHandler), document.addEventListener("mousedown", this.onMouseDownHandler);
}, /**
 * Removes all current focus element listeners.
 */
m = function() {
  this.focusEntries.forEach((e) => {
    e.el.removeEventListener("mouseenter", e.enterHandler), e.el.removeEventListener("mouseleave", e.leaveHandler);
  }), this.focusEntries = [];
}, /**
 * Processes the focusElements array. Each entry can be a string selector
 * or an object with { elements, focusClass?, mouseenter?, mouseleave? }.
 * @param {Array} focusOpts
 */
f = function(e) {
  Array.isArray(e) || (e = [e]), e.forEach((s) => {
    var r, h, a, u;
    if (typeof s == "string")
      r = document.querySelectorAll(s), h = this.focusClass;
    else {
      var o = s.elements;
      typeof o == "string" ? r = document.querySelectorAll(o) : o instanceof NodeList || Array.isArray(o) ? r = o : r = [o], h = s.focusClass || this.focusClass, a = s.mouseenter, u = s.mouseleave;
    }
    Array.from(r).forEach((l) => {
      var d = () => {
        this.DOM.element.classList.add(h), typeof a == "function" && a(this.DOM.element, l);
      }, c = () => {
        this.DOM.element.classList.remove(h), typeof u == "function" && u(this.DOM.element, l);
      };
      l.addEventListener("mouseenter", d), l.addEventListener("mouseleave", c), this.focusEntries.push({ el: l, enterHandler: d, leaveHandler: c });
    });
  });
}, T = function(e) {
  this.position.x = e.clientX, this.position.y = e.clientY;
}, p = function() {
  this.DOM.element.classList.remove(this.hiddenClass);
}, b = function() {
  this.DOM.element.classList.add(this.hiddenClass);
}, g = function() {
  this.DOM.element.classList.add(this.clickingClass), document.addEventListener("mouseup", () => {
    this.DOM.element.classList.remove(this.clickingClass);
  }, { once: !0 });
}, v = function() {
  this.DOM.styleTag || (this.DOM.styleTag = document.createElement("style"), this.DOM.styleTag.textContent = "* { cursor: none !important; }", document.head.appendChild(this.DOM.styleTag));
}, M = function() {
  this.DOM.styleTag && (this.DOM.styleTag.remove(), this.DOM.styleTag = null);
}, H = function() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
};
export {
  A as default
};
