// Generates the wabisabi mark: an enso (the Zen brush circle), the motif of
// the default wallpaper. Deterministic: the same seed gives the same file, so
// `node branding/build.mjs && git diff --exit-code` is the drift check.
//
// The stroke is drawn as several parallel "bristle" strands. They sit edge to
// edge for most of the circle and pull apart near the end, which is what a dry
// brush does. At favicon size the strands merge back into one solid band, so
// the small icon needs no separate simplified geometry.
//
// Outputs (all written, never hand-edited):
//   branding/enso.svg          the mark, ink = currentColor
//   branding/icon.svg          the mark on the ink plate, with the seal
//   web/static/icon.png        1024px, input to pwag (favicons, manifest)
//   web/static/enso.svg        the mark, for the site itself
//   web/static/preview.jpg     1280x640 social card: card.mjs, not this file
import {writeFileSync, mkdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

export const palette = {
	ink: '#182329',
	paper: '#E4D0B5',
	seal: '#B8452F',
};

// mulberry32: tiny seeded PRNG, so the strands are stable across runs.
function rng(seed) {
	return function () {
		seed |= 0;
		seed = (seed + 0x6d2b79f5) | 0;
		let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

const f = (n) => Math.round(n * 100) / 100;

function enso({cx = 128, cy = 128, r = 84, width = 34, strands = 7, seed = 7}) {
	const rand = rng(seed);
	const start = (128 * Math.PI) / 180; // lower left, where the brush lands
	const sweep = (326 * Math.PI) / 180; // clockwise on screen, up the left side, gap lower left
	const steps = 180;

	// Total width along the stroke: lands heavy, swells, then thins out.
	const w = (u) =>
		width * (0.9 + 0.2 * Math.sin(Math.PI * Math.min(1, u * 1.1))) * (1 - 0.45 * u ** 3) * (1 - 0.5 * Math.max(0, (u - 0.82) / 0.18) ** 1.5);
	// Radius wobbles a little: a hand, not a compass.
	const rad = (u) => r * (1 + 0.025 * Math.sin(u * 9.1) + 0.015 * Math.sin(u * 23.7));

	const paths = [];
	for (let s = 0; s < strands; s++) {
		// Where this strand sits across the band, -0.5 (inside) .. 0.5 (outside).
		const lo = s / strands - 0.5;
		const hi = (s + 1) / strands - 0.5;
		// Each strand runs out at a slightly different point: the dry tail.
		const end = 1 - rand() * 0.08 - (s === 0 || s === strands - 1 ? 0.04 : 0);
		const outer = [];
		const inner = [];
		for (let i = 0; i <= steps; i++) {
			const u = (i / steps) * end;
			const a = start + sweep * u;
			const width_u = w(u);
			// Hairline gaps open between strands in the last quarter of the sweep.
			const dry = Math.max(0, (u - 0.75) / 0.25);
			const gap = (width_u / strands) * 0.3 * dry;
			const mid = rad(u);
			// Each strand thins to a point around its own centre line.
			const tip = Math.min(1, (end - u) / 0.12) ** 0.6;
			const c = (lo + hi) / 2;
			const h = ((hi - lo) / 2) * tip;
			const o = mid + (c + h) * width_u - gap / 2;
			const n = mid + (c - h) * width_u + gap / 2;
			outer.push([cx + o * Math.cos(a), cy + o * Math.sin(a)]);
			inner.push([cx + n * Math.cos(a), cy + n * Math.sin(a)]);
		}
		const pts = outer.concat(inner.reverse());
		paths.push('M' + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join('L') + 'Z');
	}
	// A rounded landing where the brush first touched the paper.
	const a0 = start;
	const r0 = rad(0);
	const landing = {
		cx: f(cx + r0 * Math.cos(a0)),
		cy: f(cy + r0 * Math.sin(a0)),
		r: f(w(0) / 2),
	};
	return {d: paths.join(''), landing};
}

function ensoSvg({color = 'currentColor'} = {}) {
	const {d, landing} = enso({});
	return (
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" style="color: ${palette.paper}">` +
		`<g fill="${color}"><path d="${d}"/><circle cx="${landing.cx}" cy="${landing.cy}" r="${landing.r}"/></g>` +
		`</svg>\n`
	);
}

// The icon: paper enso on an ink plate. The vermilion seal is NOT on it: it
// sat on the stroke at 256 and became a smudge at 32 (tried and dropped).
function iconSvg() {
	const {d, landing} = enso({});
	return (
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">` +
		`<rect width="256" height="256" rx="56" fill="${palette.ink}"/>` +
		`<g transform="translate(128 128) scale(0.9) translate(-128 -128)" fill="${palette.paper}">` +
		`<path d="${d}"/><circle cx="${landing.cx}" cy="${landing.cy}" r="${landing.r}"/></g>` +
		`</svg>\n`
	);
}

function write(rel, content) {
	const p = join(root, rel);
	mkdirSync(dirname(p), {recursive: true});
	writeFileSync(p, content);
	console.log('wrote', rel);
}

write('branding/enso.svg', ensoSvg());
write('web/static/enso.svg', ensoSvg());
write('branding/icon.svg', iconSvg());

execFileSync('magick', [
	'-background', 'none', '-density', '384',
	join(root, 'branding/icon.svg'),
	'-resize', '1024x1024',
	// No timestamps in the PNG, or every run "changes" the file.
	'-strip', '-define', 'png:exclude-chunk=date,time,tIME',
	join(root, 'web/static/icon.png'),
]);
console.log('wrote web/static/icon.png');
