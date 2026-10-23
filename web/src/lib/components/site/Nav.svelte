<script lang="ts">
	import {url} from '$lib/kit/paths';
	import {nav, links} from '$lib/data/site';
</script>

<nav
	class="fixed inset-x-0 top-0 z-40 border-b border-ink-700/40 bg-ink/60 backdrop-blur-md"
	aria-label="Main"
>
	<div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
		<a href={url('/')} class="flex items-center gap-3">
			<img src={url('/enso.svg')} alt="" class="h-8 w-8" />
			<span class="font-serif text-xl tracking-wide text-paper-light">wabisabi</span>
		</a>
		<div class="flex items-center gap-1 text-sm sm:gap-2">
			{#each nav as item (item.href)}
				<a
					href={item.href}
					class="hidden rounded px-3 py-2 text-paper-dim transition hover:text-paper-light md:inline"
					>{item.label}</a
				>
			{/each}
			<a
				href={links.repo}
				class="rounded border border-ink-600 px-3 py-1.5 text-paper-dim transition hover:border-paper-dim hover:text-paper-light"
				>GitHub</a
			>
		</div>
	</div>
</nav>
