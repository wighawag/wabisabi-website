<script lang="ts">
	import {url} from '$lib/kit/paths';
	import {links} from '$lib/data/site';
</script>

<section class="relative isolate flex min-h-[100svh] items-end overflow-hidden sm:items-center">
	<img
		src={url('/img/enso-wall.webp')}
		srcset="{url('/img/enso-wall-960.webp')} 960w, {url('/img/enso-wall.webp')} 1456w"
		sizes="100vw"
		alt="A risograph print: a wide cream brush circle sweeping across dark indigo paper."
		class="absolute inset-0 -z-20 h-full w-full object-cover object-[78%_50%]"
		fetchpriority="high"
	/>
	<!-- Keep the text side as dark as the wallpaper's own ink, and let the
	     brush stroke show on the other side. -->
	<div
		class="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/70 to-ink/10 sm:bg-gradient-to-r sm:from-ink/95 sm:via-ink/55 sm:to-transparent"
	></div>

	<div class="mx-auto w-full max-w-6xl px-6 pt-28 pb-20 sm:pb-24">
		<div class="max-w-xl">
			<p class="font-mono text-xs tracking-[0.25em] text-ash uppercase">
				NixOS modules &middot; Wayland &middot; libre only
			</p>
			<h1
				class="mt-6 text-5xl leading-[1.05] font-light text-paper-light sm:text-6xl lg:text-7xl"
			>
				A desktop that stays yours.
			</h1>
			<p class="mt-6 text-lg leading-relaxed text-paper-dim sm:text-xl">
				wabisabi is an opinionated, open-source-only Wayland desktop for NixOS. Every default
				is an option you can override, the install is an ordinary flake you own, and nothing
				asks for an account.
			</p>
			<div class="mt-10 flex flex-wrap gap-4">
				<a
					href="#install"
					class="rounded-md bg-seal px-6 py-3 font-medium text-paper-light shadow-lg shadow-ink-950/40 transition hover:bg-seal-light"
				>
					Install wabisabi
				</a>
				<a
					href={links.repo}
					class="rounded-md border border-paper/30 px-6 py-3 text-paper-light transition hover:border-paper/70"
				>
					Read the source
				</a>
			</div>
		</div>
	</div>
</section>
