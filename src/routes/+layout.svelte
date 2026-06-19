<script lang="ts">
	import { untrack, type Snippet } from 'svelte';
	import { theme } from 'sveltewind/theme';
	import { default as defaultTheme } from 'sveltewind/themes';
	import { browser } from '$app/environment';

	import './layout.css';

	// Types
	type Props = {
		children: Snippet;
	};

	// $props()
	let { children }: Props = $props();

	// $state
	let isDarkMode = $state(false);

	// $effects
	$effect(() => {
		untrack(() => {
			theme.set.theme(defaultTheme);

			if (browser) {
				const localStorageDarkMode = localStorage.getItem('darkMode') || 'false';
				isDarkMode = localStorageDarkMode === 'true';
			}
		});
	});
	$effect(() => {
		document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
		if (browser) {
			localStorage.setItem('darkMode', String(isDarkMode));
		}
	});
</script>

<svelte:head>
	<link rel="icon" type="image/svg+xml" href="/icons/icon.svg" />
	<link rel="alternate icon" href="/icons/icon-16x16.png" />
	<link rel="apple-touch-icon" href="/icons/icon-apple-touch.png" />
	<link rel="manifest" href="/manifest.json" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
	<meta name="mobile-web-app-capable" content="yes" />
	<meta name="theme-color" content="#FF0040" />
	<meta
		name="viewport"
		content="width=device-width, initial-scale=1, user-scalable=no, viewport-fit=cover"
	/>
	<title>ABTL - Fire Show - 2026</title>
</svelte:head>

{@render children()}
