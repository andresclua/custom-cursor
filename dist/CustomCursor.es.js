var M = (r) => {
  throw TypeError(r);
};
var b = (r, e, s) => e.has(r) || M("Cannot " + s);
var y = (r, e, s) => e.has(r) ? M("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(r) : e.set(r, s);
var n = (r, e, s) => (b(r, e, "access private method"), s);
var t, m, f, E, C, D, L, T, g, p;
class A {
  constructor(e) {
    y(this, t);
    var { element: s, hideTrueCursor: i, disableTouch: a, focusElements: h, focusClass: u, hiddenClass: o, clickingClass: l, onInit: d, onDestroy: c } = e;
    if (this.DOM = {
      element: typeof s == "string" ? document.querySelector(s) : s,
      styleTag: null
    }, !this.DOM.element) throw new Error("CustomCursor: no valid element provided");
    this.items = Array.from(this.DOM.element.querySelectorAll("[data-lerp]")).map((v) => ({
      el: v,
      lerp: parseFloat(v.dataset.lerp) || 1,
      current: { x: 0, y: 0 }
    })), this.hideTrueCursor = i ?? !1, this.disableTouch = a ?? !0, this.focusElements = h ?? ["a", "button"], this.focusClass = u ?? "c--cursor-a--is-active", this.hiddenClass = o ?? "c--cursor-a--is-hidden", this.clickingClass = l ?? "c--cursor-a--second", this.onInit = d ?? null, this.onDestroy = c ?? null, this.initialized = !1, this.disabled = !1, this.position = { x: null, y: null }, this.rafId = null, this.focusEntries = [], this.onMouseMoveHandler = n(this, t, E).bind(this), this.onMouseEnterHandler = n(this, t, C).bind(this), this.onMouseLeaveHandler = n(this, t, D).bind(this), this.onMouseDownHandler = n(this, t, L).bind(this), !(this.disableTouch && n(this, t, p).call(this)) && (n(this, t, m).call(this), n(this, t, f).call(this));
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
        var o = s.elements;
        typeof o == "string" ? i = document.querySelectorAll(o) : o instanceof NodeList || Array.isArray(o) ? i = o : i = [o], a = s.focusClass || this.focusClass, h = s.mouseenter, u = s.mouseleave;
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
      disableTouch: e.disableTouch ?? this.disableTouch,
      focusElements: e.focusElements ?? this.focusElements,
      focusClass: e.focusClass ?? this.focusClass,
      hiddenClass: e.hiddenClass ?? this.hiddenClass,
      clickingClass: e.clickingClass ?? this.clickingClass,
      onInit: e.onInit ?? this.onInit,
      onDestroy: e.onDestroy ?? this.onDestroy
    }), n(this, t, m).call(this), n(this, t, f).call(this), this;
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
    this.initialized && (this.rafId !== null && (cancelAnimationFrame(this.rafId), this.rafId = null), this.DOM.element.classList.remove("cursor--initialized", this.hiddenClass), n(this, t, g).call(this), document.removeEventListener("mousemove", this.onMouseMoveHandler), document.removeEventListener("mouseenter", this.onMouseEnterHandler), document.removeEventListener("mouseleave", this.onMouseLeaveHandler), document.removeEventListener("mousedown", this.onMouseDownHandler), this.focusEntries.forEach((e) => {
      e.el.removeEventListener("mouseenter", e.enterHandler), e.el.removeEventListener("mouseleave", e.leaveHandler);
    }), this.focusEntries = [], typeof this.onDestroy == "function" && this.onDestroy(this.DOM.element), this.initialized = !1);
  }
}
t = new WeakSet(), // ─── Private ───────────────────────────────────────────
/**
 * Initializes the cursor, hides native cursor, registers default
 * focus elements and starts the rAF render loop.
 */
m = function() {
  if (this.initialized) return;
  this.DOM.element.classList.add("cursor--initialized"), this.hideTrueCursor && n(this, t, T).call(this), this.addFocusElements(this.focusElements);
  const e = () => {
    !this.disabled && this.position.x !== null && this.items.forEach((s) => {
      s.lerp >= 1 ? (s.current.x = this.position.x, s.current.y = this.position.y) : (s.current.x += (this.position.x - s.current.x) * s.lerp, s.current.y += (this.position.y - s.current.y) * s.lerp), s.el.style.transform = `translate3d(${s.current.x}px, ${s.current.y}px, 0)`;
    }), this.rafId = requestAnimationFrame(e);
  };
  this.rafId = requestAnimationFrame(e), this.initialized = !0, typeof this.onInit == "function" && this.onInit(this.DOM.element);
}, /**
 * Sets up document-level event listeners for mouse tracking,
 * enter/leave detection and click state.
 */
f = function() {
  document.addEventListener("mousemove", this.onMouseMoveHandler), document.addEventListener("mouseenter", this.onMouseEnterHandler), document.addEventListener("mouseleave", this.onMouseLeaveHandler), document.addEventListener("mousedown", this.onMouseDownHandler);
}, E = function(e) {
  this.position.x = e.clientX, this.position.y = e.clientY;
}, C = function() {
  this.DOM.element.classList.remove(this.hiddenClass);
}, D = function() {
  this.DOM.element.classList.add(this.hiddenClass);
}, L = function() {
  this.DOM.element.classList.add(this.clickingClass), document.addEventListener("mouseup", () => {
    this.DOM.element.classList.remove(this.clickingClass);
  }, { once: !0 });
}, T = function() {
  this.DOM.styleTag || (this.DOM.styleTag = document.createElement("style"), this.DOM.styleTag.textContent = "* { cursor: none !important; }", document.head.appendChild(this.DOM.styleTag));
}, g = function() {
  this.DOM.styleTag && (this.DOM.styleTag.remove(), this.DOM.styleTag = null);
}, p = function() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
};
export {
  A as default
};
