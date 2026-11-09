// Environment flags shared by every site module.
export const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
