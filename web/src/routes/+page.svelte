<script lang="ts">
	import Head from '$lib/Head.svelte';
	import Nav from '$lib/components/site/Nav.svelte';
	import Hero from '$lib/components/site/Hero.svelte';
	import SectionHeading from '$lib/components/site/SectionHeading.svelte';
	import CodeBlock from '$lib/components/site/CodeBlock.svelte';
	import {url} from '$lib/kit/paths';
	import {formatSize} from '$lib/data/releases';
	import {
		links,
		latestRelease,
		netinstall,
		offline,
		rules,
		principles,
		stack,
		assistant,
		anon,
		install,
		installSteps,
		keybinds,
	} from '$lib/data/site';
</script>

<Head home={true} />

<Nav />

<main>
	<Hero />

	<!-- The two rules -->
	<section id="rules" class="border-t border-ink-700/60 bg-ink">
		<div class="mx-auto max-w-6xl px-6 py-24 sm:py-32">
			<SectionHeading
				kicker="The two rules"
				title="Everything else is a default you can change."
			/>
			<div class="mt-16 grid gap-12 md:grid-cols-2">
				{#each rules as rule, i (rule.title)}
					<article class="relative pl-16">
						<span
							class="absolute top-0 left-0 font-serif text-6xl leading-none font-light text-ink-600"
							aria-hidden="true">{i + 1}</span
						>
						<h3 class="text-2xl text-paper-light">{rule.title}</h3>
						<p class="mt-3 leading-relaxed text-paper-dim">{rule.body}</p>
						<p class="mt-4 font-mono text-xs text-ash">{rule.detail}</p>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<!-- Not a distro -->
	<section class="bg-ink-900">
		<div class="mx-auto max-w-6xl px-6 py-24 sm:py-32">
			<SectionHeading
				kicker="Not a distro"
				title="The modules are the product."
				intro="An ISO is only a shortcut that installs them. No knowledge of wabisabi is needed to use the system, or to leave it."
			/>
			<div class="mt-16 grid gap-px overflow-hidden rounded-xl bg-ink-700/60 md:grid-cols-3">
				{#each principles as p (p.title)}
					<article class="bg-ink-900 p-8">
						<h3 class="text-xl text-paper-light">{p.title}</h3>
						<p class="mt-3 leading-relaxed text-paper-dim">{p.body}</p>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<!-- The stack -->
	<section id="stack" class="bg-ink">
		<div class="mx-auto max-w-6xl px-6 py-24 sm:py-32">
			<SectionHeading
				kicker="The stack"
				title="Chosen once, carefully. Swappable forever."
				intro="One palette across the whole desktop, niri's scrollable tiling underneath, and a licence next to every piece."
			/>
			<div class="mt-16 grid gap-12 lg:grid-cols-3">
				{#each stack as group (group.group)}
					<div>
						<h3 class="border-b border-ink-700 pb-3 text-lg text-paper-light">
							{group.group}
						</h3>
						<dl class="divide-y divide-ink-800">
							{#each group.rows as row (row.role)}
								<div class="py-3">
									<dt class="text-xs tracking-wider text-ash uppercase">{row.role}</dt>
									<dd class="mt-1 flex items-baseline justify-between gap-4">
										<span class="text-paper">{row.choice}</span>
										<span class="shrink-0 font-mono text-[0.7rem] text-stone"
											>{row.license}</span
										>
									</dd>
								</div>
							{/each}
						</dl>
					</div>
				{/each}
			</div>

			<div class="mt-20 rounded-xl border border-ink-700 bg-ink-900/60 p-8">
				<p class="font-mono text-xs tracking-[0.25em] text-ash uppercase">
					Scrollable tiling
				</p>
				<p class="mt-3 max-w-2xl leading-relaxed text-paper-dim">
					Windows sit in columns on an endless horizontal strip, and opening one never resizes
					the others. A handful of keys is enough to start.
				</p>
				<ul class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{#each keybinds as k (k.action)}
						<li class="flex items-center gap-3">
							<span class="flex gap-1">
								{#each k.keys as key (key)}
									<kbd
										class="rounded border border-ink-600 border-b-2 bg-ink-800 px-2 py-0.5 font-mono text-xs text-paper-light"
										>{key}</kbd
									>
								{/each}
							</span>
							<span class="text-sm text-paper-dim">{k.action}</span>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</section>

	<!-- The assistant -->
	<section id="assistant" class="relative overflow-hidden bg-ink-900">
		<img
			src={url('/enso.svg')}
			alt=""
			class="pointer-events-none absolute -top-40 -right-40 w-[36rem] opacity-[0.05]"
		/>
		<div class="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
			<SectionHeading
				kicker="AI and privacy, on the machine"
				title="An assistant that needs no account anywhere."
				intro="A local model, private web search and a coding agent wired to both, with a web UI for its sessions on this machine only. All on by default, each one a single option."
			/>
			<div class="mt-16 grid gap-10 md:grid-cols-3">
				{#each assistant as a (a.title)}
					<article>
						<div class="mb-5 h-px w-12 bg-paper-dim"></div>
						<h3 class="text-xl text-paper-light">{a.title}</h3>
						<p class="mt-3 leading-relaxed text-paper-dim">{a.body}</p>
					</article>
				{/each}
			</div>

			<article
				class="mt-20 grid gap-8 rounded-xl border border-ink-700 bg-ink-950/70 p-8 md:grid-cols-[1fr_auto] md:items-center"
			>
				<div>
					<h3 class="text-2xl text-paper-light">{anon.title}</h3>
					<p class="mt-3 max-w-3xl leading-relaxed text-paper-dim">{anon.body}</p>
				</div>
				<pre
					class="rounded-lg bg-ink-900 px-5 py-4 font-mono text-sm text-paper-light">anonctl verify</pre>
			</article>
			<p class="mt-8 text-sm text-ash">
				The building blocks live in
				<a class="underline decoration-ink-600 underline-offset-4 hover:text-paper" href={links.modules}
					>nixos-modules</a
				>, usable on any NixOS machine. What was verified and what was not:
				<a
					class="underline decoration-ink-600 underline-offset-4 hover:text-paper"
					href={links.agentNotes}>notes/agents.md</a
				>.
			</p>
		</div>
	</section>

	<!-- Install -->
	<section id="install" class="bg-ink">
		<div class="mx-auto max-w-6xl px-6 py-24 sm:py-32">
			<SectionHeading
				kicker="Install"
				title="Install it. Then keep the repo."
				intro="Boot the installer, answer a few questions, and what you are left with is a flake you own."
			/>

			<div class="mt-12 rounded-xl border border-ink-700 bg-ink-900/60 p-8">
				<p class="font-mono text-xs tracking-[0.25em] text-ash uppercase">
					v{$latestRelease.version} &middot; preview
				</p>
				<div class="mt-6 grid gap-6 {$offline ? 'md:grid-cols-2' : ''}">
					{#if $offline}
						<div class="flex flex-col justify-between gap-4">
							<div>
								<p class="text-xl text-paper-light">Live ISO</p>
								<p class="mt-1 text-sm text-paper-dim">
									{formatSize($offline.size)}. Boots into the desktop to try it, then installs with
									no network.
								</p>
							</div>
							<a
								href={$offline.url}
								class="self-start rounded-md bg-seal px-6 py-3 text-center font-medium text-paper-light transition hover:bg-seal-light"
								>Download the live ISO</a
							>
						</div>
					{/if}
					{#if $netinstall}
						<div class="flex flex-col justify-between gap-4">
							<div>
								<p class="text-xl text-paper-light">Netinstall ISO</p>
								<p class="mt-1 text-sm text-paper-dim">
									{formatSize($netinstall.size)}. A text installer that downloads the rest; needs a
									network.
								</p>
							</div>
							<a
								href={$netinstall.url}
								class="self-start rounded-md px-6 py-3 text-center font-medium transition {$offline
									? 'border border-paper/30 text-paper-light hover:border-paper/70'
									: 'bg-seal text-paper-light hover:bg-seal-light'}">Download the netinstall ISO</a
							>
						</div>
					{/if}
				</div>
				<p class="mt-6 text-sm text-ash">
					UEFI only.
					<a class="underline decoration-ink-600 underline-offset-4 hover:text-paper" href={$latestRelease.sums}
						>SHA256SUMS</a
					>
					&middot;
					<a class="underline decoration-ink-600 underline-offset-4 hover:text-paper" href={$latestRelease.notes}
						>release notes</a
					>
				</p>
			</div>

			<ol class="mt-16 grid gap-10 md:grid-cols-3">
				{#each installSteps as step, i (step.title)}
					<li>
						<span class="font-mono text-xs text-ash">0{i + 1}</span>
						<h3 class="mt-2 text-xl text-paper-light">{step.title}</h3>
						<p class="mt-3 leading-relaxed text-paper-dim">{step.body}</p>
					</li>
				{/each}
			</ol>

			<div class="mt-16 grid gap-8 lg:grid-cols-2 [&>*]:min-w-0">
				<div class="space-y-3">
					<h3 class="text-lg text-paper-light">Check it, write it, install</h3>
					<CodeBlock code={install.flash} />
				</div>
				<div class="space-y-3">
					<h3 class="text-lg text-paper-light">Or build an ISO yourself</h3>
					<p class="text-sm leading-relaxed text-paper-dim">
						Any version, from its tag: the same image, from source.
					</p>
					<CodeBlock code={install.live} />
				</div>
				<div class="space-y-3">
					<h3 class="text-lg text-paper-light">Then the machine is the repo</h3>
					<p class="text-sm leading-relaxed text-paper-dim">
						Change it by editing it. <code class="font-mono text-paper">/etc/nixos</code> links here,
						so no flag is needed.
					</p>
					<CodeBlock code={install.repo} />
				</div>
				<div class="space-y-3">
					<h3 class="text-lg text-paper-light">Secrets that can be pushed</h3>
					<p class="text-sm leading-relaxed text-paper-dim">
						Encrypted with sops to one age key. Keep a copy of the key: the repo plus the key is
						the whole machine.
					</p>
					<CodeBlock code={install.secrets} label="secrets" />
				</div>
				<div class="space-y-3">
					<h3 class="text-lg text-paper-light">Already on NixOS?</h3>
					<p class="text-sm leading-relaxed text-paper-dim">
						Add the flake input, import the two modules, and opt in per host and per user. Both
						are inert until enabled.
					</p>
					<CodeBlock code={install.existing} label="configuration.nix" />
				</div>
				<div class="space-y-3">
					<h3 class="text-lg text-paper-light">Or by hand, without the ISO</h3>
					<p class="text-sm leading-relaxed text-paper-dim">
						The installer fills in this same template, so the two paths cannot diverge.
					</p>
					<CodeBlock code={install.byHand} />
				</div>
			</div>

			<p class="mt-12 text-sm text-ash">
				How the installer works, restoring after a wipe, fleet repos and what is verified:
				<a
					class="underline decoration-ink-600 underline-offset-4 hover:text-paper"
					href={links.installerNotes}>notes/installer.md</a
				>.
			</p>
		</div>
	</section>
	<!-- Closing band: the wallpaper again, mirrored, so the page ends where it began. -->
	<section class="relative isolate overflow-hidden">
		<img
			src={url('/img/enso-wall-960.webp')}
			srcset="{url('/img/enso-wall-960.webp')} 960w, {url('/img/enso-wall.webp')} 1456w"
			sizes="100vw"
			alt=""
			loading="lazy"
			class="absolute inset-0 -z-20 h-full w-full -scale-x-100 object-cover object-[80%_60%]"
		/>
		<div
			class="absolute inset-0 -z-10 bg-gradient-to-b from-ink/95 via-ink/85 to-ink-950/80 sm:bg-gradient-to-l sm:from-ink/95 sm:via-ink/50 sm:to-ink/10"
		></div>
		<div class="mx-auto flex max-w-6xl justify-end px-6 py-32 sm:py-44">
			<div class="max-w-md text-right">
				<p class="font-serif text-4xl leading-tight font-light text-paper-light sm:text-5xl">
					Imperfect, impermanent, yours.
				</p>
				<p class="mt-5 text-paper-dim">
					Nothing about it needs to last longer than you want it to. Take what you like, override
					the rest, leave whenever.
				</p>
				<a
					href="#install"
					class="mt-8 inline-block rounded-md bg-seal px-6 py-3 font-medium text-paper-light transition hover:bg-seal-light"
					>Install wabisabi</a
				>
			</div>
		</div>
	</section>
</main>

<footer class="border-t border-ink-700/60 bg-ink-950">
	<div
		class="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-12 sm:flex-row sm:items-center"
	>
		<div class="flex flex-wrap items-center gap-x-3 gap-y-1">
			<img src={url('/enso.svg')} alt="" class="h-7 w-7" />
			<span class="font-serif text-lg whitespace-nowrap text-paper-light">wabisabi</span>
			<span class="w-full text-sm text-ash sm:w-auto">Open source only. Nothing to sign up for.</span>
		</div>
		<div class="flex gap-6 text-sm text-paper-dim">
			<a class="hover:text-paper-light" href={links.readme}>README</a>
			<a class="hover:text-paper-light" href={links.notes}>Notes</a>
			<a class="hover:text-paper-light" href={links.repo}>GitHub</a>
		</div>
	</div>
</footer>
