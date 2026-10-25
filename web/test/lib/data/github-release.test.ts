import {describe, expect, it} from 'vitest';
import {pickFallback} from '../../../src/lib/data/github-release';
import committed from '../../../src/lib/data/fallback-release.json';
import {fileOf, parseReleases} from '../../../src/lib/data/releases';

const sha = (c: string) => `sha256:${c.repeat(64)}`;
const iso = (tag: string, digest = sha('a')) => ({
	name: 'wabisabi-netinstall.iso',
	size: 1561657344,
	digest,
	browser_download_url: `https://github.com/wighawag/wabisabi/releases/download/${tag}/wabisabi-netinstall.iso`,
});
const sums = (tag: string) => ({
	name: 'SHA256SUMS',
	size: 90,
	digest: sha('b'),
	browser_download_url: `https://github.com/wighawag/wabisabi/releases/download/${tag}/SHA256SUMS`,
});
const release = (tag: string, assets: unknown[], extra = {}) => ({
	tag_name: tag,
	draft: false,
	prerelease: true,
	published_at: '2026-10-24T20:10:00Z',
	html_url: `https://github.com/wighawag/wabisabi/releases/tag/${tag}`,
	assets,
	...extra,
});

describe('pickFallback', () => {
	it('takes the newest release that carries the netinstall ISO, prereleases included', () => {
		const r = pickFallback([
			release('v0.5.0', []), // tagged, ISO not attached yet
			release('v0.4.0', [iso('v0.4.0'), sums('v0.4.0')]),
			release('v0.1.0', [iso('v0.1.0')]),
		]);
		expect(r).toEqual({
			version: '0.4.0',
			date: '2026-10-24',
			files: [
				{
					name: 'wabisabi-netinstall.iso',
					kind: 'netinstall',
					size: 1561657344,
					sha256: 'a'.repeat(64),
					url: 'https://github.com/wighawag/wabisabi/releases/download/v0.4.0/wabisabi-netinstall.iso',
				},
			],
			sums: 'https://github.com/wighawag/wabisabi/releases/download/v0.4.0/SHA256SUMS',
			notes: 'https://github.com/wighawag/wabisabi/releases/tag/v0.4.0',
		});
	});

	it('skips drafts and assets without a sha256 digest', () => {
		const r = pickFallback([
			release('v0.6.0', [iso('v0.6.0')], {draft: true}),
			release('v0.5.0', [iso('v0.5.0', 'md5:abc')]),
			release('v0.4.0', [iso('v0.4.0')]),
		]);
		expect(r?.version).toBe('0.4.0');
	});

	it('links the release page when there is no SHA256SUMS asset', () => {
		expect(pickFallback([release('v0.4.0', [iso('v0.4.0')])])?.sums).toBe(
			'https://github.com/wighawag/wabisabi/releases/tag/v0.4.0',
		);
	});

	it('gives nothing rather than throwing on junk', () => {
		expect(pickFallback(null)).toBeUndefined();
		expect(pickFallback({message: 'API rate limit exceeded'})).toBeUndefined();
		expect(pickFallback([1, 'x', {tag_name: 'nightly', assets: [iso('nightly')]}])).toBeUndefined();
	});
});

describe('the committed fallback', () => {
	it('is a netinstall release on GitHub, valid as the bucket would describe it', () => {
		expect(fileOf(committed as never, 'netinstall')?.url).toMatch(/^https:\/\/github\.com\/wighawag\/wabisabi\/releases\/download\//);
		// Same shape the live index parses into.
		expect(parseReleases({releases: [committed]}).length).toBe(1);
	});
});
