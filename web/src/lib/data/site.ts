import {derived} from 'svelte/store';
import {createLatestRelease, fileOf, type Release} from './releases';
import fallback from './fallback-release.json';

/**
 * Everything the home page says, as data. The source of truth is the
 * wabisabi README; when it changes, this file is what follows it.
 */

export const links = {
	repo: 'https://github.com/wighawag/wabisabi',
	readme: 'https://github.com/wighawag/wabisabi#readme',
	modules: 'https://github.com/wighawag/nixos-modules',
	notes: 'https://github.com/wighawag/wabisabi/tree/main/notes',
	installerNotes: 'https://github.com/wighawag/wabisabi/blob/main/notes/installer.md',
	agentNotes: 'https://github.com/wighawag/wabisabi/blob/main/notes/agents.md',
};

// What can be downloaded. Live from the release bucket (see releases.ts);
// until it answers, or if it never does, the page shows this: the netinstall
// ISO of the newest GitHub release carrying one, refreshed before each build
// (scripts/fallback-release.ts, github-release.ts).
export const fallbackRelease = fallback as Release;

export const latestRelease = createLatestRelease(fallbackRelease);
export const netinstall = derived(latestRelease, (r) => fileOf(r, 'netinstall'));
export const offline = derived(latestRelease, (r) => fileOf(r, 'offline'));

export const nav = [
	{href: '#rules', label: 'Principles'},
	{href: '#stack', label: 'Stack'},
	{href: '#assistant', label: 'Assistant'},
	{href: '#install', label: 'Install'},
];

export const rules = [
	{
		title: 'Open source only.',
		body: 'Enforced at build time, not promised in a README. The system layer asserts that allowUnfree is off and fails the build otherwise.',
		detail: 'wabisabi.enforceLibre = false opts out, in the open.',
	},
	{
		title: 'No service you cannot run yourself.',
		body: 'Every app works fully locally or against infrastructure you can host. No vendor accounts by default.',
		detail: 'Sync is Syncthing, passwords are KeePassXC, search is SearXNG.',
	},
];

export const principles = [
	{
		title: 'Every default is an option',
		body: 'Both layers set everything with mkDefault, so anything you write wins. Nothing is a dotfile you must not touch: extend, override or ignore any part.',
	},
	{
		title: 'An ordinary flake you own',
		body: 'The installer leaves a plain flake in ~/nixos, as a git repo with two commits. Nothing reads it back and nothing manages it. The machine changes when the repo changes.',
	},
	{
		title: 'Easy to leave',
		body: 'Remove the two module imports and you have a working NixOS machine that has never heard of wabisabi. Not a distro: the modules are the product.',
	},
];

export type StackRow = {role: string; choice: string; license: string};

export const stack: {group: string; rows: StackRow[]}[] = [
	{
		group: 'Desktop',
		rows: [
			{role: 'Compositor', choice: 'niri, scrollable tiling', license: 'GPL-3.0'},
			{role: 'Login', choice: 'greetd + Noctalia greeter, or tuigreet', license: 'GPL / MIT'},
			{role: 'Shell', choice: 'Noctalia, or Waybar + fuzzel + mako', license: 'MIT'},
			{role: 'Lock and idle', choice: 'swaylock + swayidle', license: 'MIT'},
			{role: 'Terminal', choice: 'Ghostty, or foot, kitty', license: 'MIT / GPL'},
			{role: 'Files', choice: 'Thunar, or Nautilus', license: 'GPL'},
		],
	},
	{
		group: 'Everyday',
		rows: [
			{role: 'Browser', choice: 'Firefox, or LibreWolf, Chromium', license: 'MPL'},
			{role: 'Editors', choice: 'Neovim and Helix, both ship', license: 'Apache-2.0 / MPL'},
			{role: 'Passwords', choice: 'KeePassXC, local-first', license: 'GPL'},
			{role: 'Sync', choice: 'Syncthing, peer to peer', license: 'MPL'},
			{role: 'Media', choice: 'mpv + imv', license: 'GPL / MIT'},
			{role: 'Reading', choice: 'Papers + Foliate', license: 'GPL'},
			{role: 'Scanning', choice: 'Document Scanner + XSane, driverless', license: 'GPL'},
			{role: 'Terminal tools', choice: 'bash + ble.sh, fzf, zoxide, atuin, zellij, lazygit, micro', license: 'BSD / MIT'},
		],
	},
	{
		group: 'One option away',
		rows: [
			{role: 'Creative', choice: 'GIMP, Inkscape, OBS Studio', license: 'GPL'},
			{role: 'Developer tools', choice: 'Node.js, pnpm, uv, clang, cmake, Zed', license: 'MIT / GPL'},
			{role: 'Virtual machines', choice: 'libvirt + QEMU/KVM + virt-manager', license: 'GPL / LGPL'},
			{role: 'Torrents', choice: 'qBittorrent', license: 'GPL'},
			{role: 'Flatpak', choice: 'Flathub + Flatseal, outside the libre rule', license: 'LGPL'},
		],
	},
	{
		group: 'On the machine',
		rows: [
			{role: 'Local model', choice: 'llama.cpp + Gemma 4 E4B, on the CPU', license: 'MIT / Apache-2.0'},
			{role: 'Coding agent', choice: 'pi, with wherever as its web UI', license: 'MIT / AGPL'},
			{role: 'Search', choice: 'SearXNG + webveil', license: 'AGPL'},
			{role: 'Recall', choice: 'memonaut, your past agent sessions', license: 'AGPL'},
			{role: 'Browser automation', choice: 'webhands on Chromium', license: 'AGPL / BSD'},
			{role: 'Anonymous accounts', choice: 'anonctl, every packet through Tor', license: 'AGPL'},
		],
	},
];

export const assistant = [
	{
		title: 'A model that never leaves',
		body: 'A small open-weights model runs on the CPU and answers on a unix socket. No API key, no account, no network needed to think.',
	},
	{
		title: 'Search without a profile',
		body: 'SearXNG and webveil give the agent the web with nothing to log in to. The pi coding agent is wired to both from the first boot.',
	},
	{
		title: 'One key away',
		body: 'Super+A, the Assistant launcher entry or the bar button opens its web UI, served on this machine only.',
	},
];

export const anon = {
	title: 'Three accounts that cannot leak your address',
	body: 'anon, anon-john and anon-jane have every connection forced through Tor by the kernel, fail-closed: if Tor is down they have no network, never yours. Each is proven with anonctl verify before use, carries nothing of yours, and has its own agent on the same local model.',
};

export const install = {
	flash: `sha256sum -c --ignore-missing SHA256SUMS
sudo dd if=wabisabi-netinstall.iso of=/dev/sdX bs=4M status=progress oflag=sync
# boot the stick, then:
sudo wabisabi-install

# or with nix: one stick for the installer AND an encrypted restore kit
nix build github:wighawag/wabisabi#usb -o /tmp/wabisabi-usb
sudo /tmp/wabisabi-usb/bin/wabisabi-usb write /dev/sdX --release netinstall --kit`,
	live: `nix build github:wighawag/wabisabi#iso-offline
# write result/iso/*.iso to a USB stick, boot it`,
	repo: `cd ~/nixos && $EDITOR configuration.nix
sudo nixos-rebuild switch
git commit -am "..." && git push`,
	secrets: `wabisabi-secrets edit       # decrypted, in $EDITOR
wabisabi-secrets password   # in the repo and now
wabisabi-secrets backup     # show the age key again`,
	existing: `{
  wabisabi.enable = true;          # system layer
  home-manager.users.me = {
    imports = [ wabisabi.homeModules.wabisabi ];
    wabisabi.enable = true;        # apps, dotfiles, keys
  };
}`,
	byHand: `nix flake new -t github:wighawag/wabisabi ~/nixos
cd ~/nixos && git init && git add -A
sudo nixos-rebuild switch --flake ~/nixos`,
};

export const installSteps = [
	{
		title: 'Boot the installer',
		body: 'Write an ISO to a USB stick and boot it on a UEFI machine. The live ISO boots straight into the desktop, so you can try it before anything touches the disk; the netinstall one is smaller and fetches the rest.',
	},
	{
		title: 'Answer a few questions',
		body: 'Hostname, user, keyboard layout, disk, and whether to encrypt secrets. Skip the rest and you get the defaults, which keep following the project.',
	},
	{
		title: 'Keep the repo',
		body: 'Your machine is ~/nixos. Secrets are encrypted with sops to one age key, so the repo can be pushed anywhere. The repo plus the key is the whole machine: after a wipe, restore rebuilds it, from a restore kit on the installer stick itself (wabisabi-usb).',
	},
];

export const keybinds = [
	{keys: ['Super', 'Enter'], action: 'Terminal'},
	{keys: ['Super', 'D'], action: 'Launcher'},
	{keys: ['Super', 'A'], action: 'The assistant'},
	{keys: ['Super', 'H J K L'], action: 'Move focus'},
	{keys: ['Super', 'O'], action: 'Overview'},
	{keys: ['Super', 'Shift', '/'], action: 'Every other key'},
];
