# wabisabi-website

The website of [wabisabi](https://github.com/wighawag/wabisabi), a libre-only Wayland desktop shipped as NixOS modules. A static SvelteKit site, served at [wabisabi.computer](https://wabisabi.computer), built on [template-svelte-tailwind](https://github.com/wighawag/template-svelte-tailwind), which it tracks through the `stem` git remote.

## Develop

```sh
pnpm i
pnpm web:dev      # dev server
pnpm verify       # type check, unit tests, static build into web/build
```

## Deploy

GitHub Pages, by `.github/workflows/pages.yml`: every push to `main` is checked, tested, built and published, at [wabisabi.computer](https://wabisabi.computer) (the custom domain is set in the repo's Pages settings; its DNS is on Cloudflare, "DNS only", pointing at GitHub's Pages addresses).

The downloads are not here. They live in wabisabi's R2 bucket at `https://downloads.wabisabi.computer`, and the download card reads its `releases.json` in the browser (see `web/src/lib/data/releases.ts`), so publishing or deleting a release with wabisabi's `scripts/release.sh` changes the site without a rebuild. Until that answers, the card shows the release baked into `web/src/lib/data/site.ts`.

## Where things are

- `web/src/lib/data/site.ts`: everything the home page says. The source of truth is the wabisabi README; when that changes, this file follows it.
- `web/src/routes/+page.svelte` and `web/src/lib/components/site/`: layout only, no logic (see `AGENTS.md`).
- `web/src/app.css`: the palette, sampled from the ensō risograph wallpaper, and the paper grain.
- `web/src/lib/data/releases.ts`: the download card's data, read live from the release bucket.
- `branding/`: the mark and the social card, generated. See `branding/README.md`.

## Look

The page is built around one wallpaper, the ensō risograph print (`web/static/img/enso-wall*.webp`, from `wallpapers/` in the wabisabi repo): indigo ink on warm paper, Fraunces for headings, Inter for text, JetBrains Mono (the desktop's own font) for code. All fonts are bundled from `@fontsource`, so the site makes no third-party request, in keeping with the project's second rule.
