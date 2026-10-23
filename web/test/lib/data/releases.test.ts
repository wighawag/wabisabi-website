import {describe, expect, it} from 'vitest';
import {get} from 'svelte/store';
import {createLatestRelease, fileOf, formatSize, parseReleases, type Release} from '../../../src/lib/data/releases';

const base = 'https://downloads.example';

const good = {
	releases: [
		{
			version: '0.2.0',
			date: '2026-10-01',
			files: [
				{name: 'wabisabi-offline.iso', kind: 'offline', size: 9179271168, sha256: 'aa'},
				{name: 'wabisabi-netinstall.iso', kind: 'netinstall', size: 1557233664, sha256: 'bb'},
			],
		},
		{version: '0.1.0', date: '2026-09-29', files: [{name: 'wabisabi-netinstall.iso', kind: 'netinstall', size: 1, sha256: 'cc'}]},
	],
};

describe('parseReleases', () => {
	it('keeps the order, and builds URLs under the version folder', () => {
		const r = parseReleases(good, base);
		expect(r.map((x) => x.version)).toEqual(['0.2.0', '0.1.0']);
		expect(fileOf(r[0], 'offline')?.url).toBe(`${base}/v0.2.0/wabisabi-offline.iso`);
		expect(r[0].sums).toBe(`${base}/v0.2.0/SHA256SUMS`);
		expect(r[0].notes).toBe('https://github.com/wighawag/wabisabi/releases/tag/v0.2.0');
	});

	it('drops what it cannot trust instead of throwing', () => {
		expect(parseReleases(null)).toEqual([]);
		expect(parseReleases({releases: 'nope'})).toEqual([]);
		const r = parseReleases(
			{
				releases: [
					{version: '../etc', files: [{name: 'x.iso', kind: 'netinstall', size: 1, sha256: 'a'}]},
					{version: '1.0.0', files: [{name: '../../evil', kind: 'netinstall', size: 1, sha256: 'a'}]},
					{version: '1.0.1', files: [{name: 'a.iso', kind: 'mystery', size: 1, sha256: 'a'}]},
				],
			},
			base,
		);
		// A bad version, a path in a file name and an unknown kind: nothing left.
		expect(r).toEqual([]);
	});
});

describe('formatSize', () => {
	it('uses decimal units, as download bars do', () => {
		expect(formatSize(1557233664)).toBe('1.56 GB');
		expect(formatSize(9179271168)).toBe('9.18 GB');
		expect(formatSize(12_300_000_000)).toBe('12.3 GB');
		expect(formatSize(850_000_000)).toBe('850 MB');
	});
});

describe('createLatestRelease', () => {
	const fallback: Release = parseReleases(good, base)[1];

	it('is the fallback where there is no window (prerendering)', () => {
		const store = createLatestRelease(fallback, (() => {
			throw new Error('must not fetch on the server');
		}) as unknown as typeof fetch);
		expect(get(store).version).toBe('0.1.0');
	});
});
