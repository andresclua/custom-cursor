import { cursor } from './cursor.js';

window.__cursor = cursor; // handle for manual checks

const page = document.body.dataset.page;
import('./hud.js').then(({ initHud }) => initHud());

async function home() {
	const [{ initWall }, { initLerp }, { initFocus }, { initText }, { initMagnetic }, { initBlend }, { initFinal }, { initScroll }] = await Promise.all([
		import('./chapters/wall.js'), import('./chapters/lerp.js'), import('./chapters/focus.js'), import('./chapters/text.js'),
		import('./chapters/magnetic.js'), import('./chapters/blend.js'), import('./chapters/final.js'), import('./scroll.js'),
	]);
	initWall(); initLerp(); initFocus(); initText(); initMagnetic(); initBlend(); initFinal(); initScroll();
}

async function api() {
	const [{ initApi }, { initCodeCopy }] = await Promise.all([import('./api.js'), import('./code.js')]);
	initApi(); initCodeCopy();
}

async function examples() {
	const [{ initExamples }, { initCodeCopy }] = await Promise.all([import('./examples.js'), import('./code.js')]);
	initExamples(); initCodeCopy();
}

if (page === 'home') home();
if (page === 'examples') examples();
if (page === 'api') api();
