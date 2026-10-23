/**
 * What is downloadable, read from the release bucket's `releases.json`.
 *
 * The bucket is the source of truth, written by wabisabi's
 * `scripts/release.sh`: publishing or deleting a version updates it, and the
 * site follows without a rebuild. The prerendered page shows `fallback`
 * (the release baked in at build time) and swaps in the live list once it
 * arrives, so a missing or unreachable bucket costs nothing but freshness.
 */
import {readable, type Readable} from 'svelte/store';

export const DOWNLOADS = 'https://downloads.wabisabi.computer';

export type ReleaseFile = {
	name: string;
	/** netinstall: text installer, needs a network. offline: the live ISO. */
	kind: 'netinstall' | 'offline';
	size: number;
	sha256: string;
	url: string;
};

export type Release = {
	version: string;
	date: string;
	files: ReleaseFile[];
	/** The SHA256SUMS file for the whole version. */
	sums: string;
	notes: string;
};

const isRecord = (v: unknown): v is Record<string, unknown> =>
	typeof v === 'object' && v !== null && !Array.isArray(v);

/**
 * Parse releases.json, newest first. Anything malformed is dropped rather
 * than thrown: a half-broken list should still show what it can.
 */
export function parseReleases(json: unknown, base = DOWNLOADS): Release[] {
	if (!isRecord(json) || !Array.isArray(json.releases)) return [];
	const out: Release[] = [];
	for (const r of json.releases) {
		if (!isRecord(r) || typeof r.version !== 'string' || !/^\d+\.\d+\.\d+/.test(r.version)) continue;
		const dir = `${base}/v${r.version}`;
		const files: ReleaseFile[] = [];
		for (const f of Array.isArray(r.files) ? r.files : []) {
			if (
				isRecord(f) &&
				typeof f.name === 'string' &&
				/^[\w.-]+$/.test(f.name) &&
				(f.kind === 'netinstall' || f.kind === 'offline') &&
				typeof f.size === 'number' &&
				typeof f.sha256 === 'string'
			) {
				files.push({name: f.name, kind: f.kind, size: f.size, sha256: f.sha256, url: `${dir}/${f.name}`});
			}
		}
		if (files.length === 0) continue;
		out.push({
			version: r.version,
			date: typeof r.date === 'string' ? r.date : '',
			files,
			sums: `${dir}/SHA256SUMS`,
			notes: `https://github.com/wighawag/wabisabi/releases/tag/v${r.version}`,
		});
	}
	return out;
}

export function fileOf(release: Release, kind: ReleaseFile['kind']): ReleaseFile | undefined {
	return release.files.find((f) => f.kind === kind);
}

/** 1557233664 -> "1.56 GB" (decimal, as disks and download bars count). */
export function formatSize(bytes: number): string {
	if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(bytes >= 1e10 ? 1 : 2)} GB`;
	return `${Math.round(bytes / 1e6)} MB`;
}

/**
 * The newest release: `fallback` at first (and on the server, while
 * prerendering), then whatever the bucket says, if it answers.
 */
export function createLatestRelease(
	fallback: Release,
	fetchFn: typeof fetch | undefined = typeof fetch === 'undefined' ? undefined : fetch,
	url = `${DOWNLOADS}/releases.json`,
): Readable<Release> {
	return readable(fallback, (set) => {
		if (typeof window === 'undefined' || !fetchFn) return;
		let cancelled = false;
		fetchFn(url, {cache: 'no-cache'})
			.then((res) => (res.ok ? res.json() : null))
			.then((json) => {
				const latest = parseReleases(json)[0];
				if (!cancelled && latest) set(latest);
			})
			.catch(() => {
				// Offline, blocked, or the bucket does not exist yet: keep the fallback.
			});
		return () => {
			cancelled = true;
		};
	});
}
