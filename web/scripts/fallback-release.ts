/**
 * Refresh src/lib/data/fallback-release.json from wabisabi's GitHub releases
 * (see src/lib/data/github-release.ts). Runs before every build.
 *
 * A failure (offline, rate-limited, no release with the ISO yet) keeps the
 * committed file and only warns: the fallback going stale must never stop a
 * build. Set GITHUB_TOKEN to lift the anonymous rate limit (CI does).
 */
import {readFileSync, writeFileSync} from 'node:fs';
import {GITHUB_RELEASES, pickFallback} from '../src/lib/data/github-release.ts';

const out = new URL('../src/lib/data/fallback-release.json', import.meta.url);

try {
	const headers: Record<string, string> = {accept: 'application/vnd.github+json'};
	if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
	const res = await fetch(`${GITHUB_RELEASES}?per_page=30`, {headers, signal: AbortSignal.timeout(15000)});
	if (!res.ok) throw new Error(`GitHub answered ${res.status}`);
	const release = pickFallback(await res.json());
	if (!release) throw new Error('no release carries the netinstall ISO');
	const text = JSON.stringify(release, null, '\t') + '\n';
	if (text !== readFileSync(out, 'utf8')) {
		writeFileSync(out, text);
		console.log(`fallback release: now v${release.version}`);
	} else {
		console.log(`fallback release: v${release.version}, unchanged`);
	}
} catch (e) {
	console.warn(`fallback release: kept the committed one (${(e as Error).message})`);
}
