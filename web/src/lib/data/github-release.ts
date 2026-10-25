/**
 * The page's fallback release, picked from wabisabi's GitHub releases.
 *
 * The bucket (releases.ts) is what the page shows once it loads; this is what
 * it shows before that, or if the bucket never answers. It has to outlive the
 * bucket's versions, which are deleted when a newer one is published, so it
 * points at GitHub, where wabisabi's `scripts/release.sh` attaches the
 * netinstall ISO (the offline one is over GitHub's 2 GiB asset limit, so it is
 * only ever in the bucket). `scripts/fallback-release.ts` runs this before
 * each build and writes the result to `fallback-release.json`.
 *
 * No imports but types: the build script runs this file with plain node.
 */
import type {Release} from './releases';

export const GITHUB_RELEASES = 'https://api.github.com/repos/wighawag/wabisabi/releases';
export const NETINSTALL = 'wabisabi-netinstall.iso';

const isRecord = (v: unknown): v is Record<string, unknown> =>
	typeof v === 'object' && v !== null && !Array.isArray(v);

/**
 * The newest published release (the API lists newest first) carrying the
 * netinstall ISO with a sha256 digest, as a netinstall-only Release, or
 * undefined if there is none.
 */
export function pickFallback(json: unknown): Release | undefined {
	if (!Array.isArray(json)) return undefined;
	for (const r of json) {
		if (!isRecord(r) || r.draft === true || typeof r.tag_name !== 'string') continue;
		const version = r.tag_name.replace(/^v/, '');
		if (!/^\d+\.\d+\.\d+/.test(version) || !Array.isArray(r.assets)) continue;
		const assets = r.assets.filter(isRecord);
		const iso = assets.find((a) => a.name === NETINSTALL);
		const sha256 = typeof iso?.digest === 'string' ? /^sha256:([0-9a-f]{64})$/.exec(iso.digest)?.[1] : undefined;
		if (!iso || !sha256 || typeof iso.size !== 'number' || typeof iso.browser_download_url !== 'string') continue;
		const notes = typeof r.html_url === 'string' ? r.html_url : `https://github.com/wighawag/wabisabi/releases/tag/${r.tag_name}`;
		const sums = assets.find((a) => a.name === 'SHA256SUMS')?.browser_download_url;
		return {
			version,
			date: typeof r.published_at === 'string' ? r.published_at.slice(0, 10) : '',
			files: [{name: NETINSTALL, kind: 'netinstall', size: iso.size, sha256, url: iso.browser_download_url}],
			sums: typeof sums === 'string' ? sums : notes,
			notes,
		};
	}
	return undefined;
}
