<script lang="ts">
	import { untrack, type Snippet } from 'svelte';
	import { theme } from 'sveltewind/theme';
	import { default as defaultTheme } from 'sveltewind/themes';
	import { twMerge } from 'tailwind-merge';
	import { browser } from '$app/environment';
	import { Div } from '$lib/components';

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

			const defaults = {
				background: {
					base: 'bg-white dark:bg-gray-900',
					primary: 'bg-primary-500'
				},
				duration: 'duration-200',
				outline: 'outline outline-gray-200 dark:outline-gray-800',
				padding: {
					both: 'p-6',
					input: 'px-6 py-3',
					x: 'px-6',
					y: 'py-6'
				},
				rounded: 'rounded-2xl',
				shadow: 'shadow-sm dark:shadow-black',
				transition: 'transition'
			};

			theme.update.theme({
				button: {
					base: twMerge(
						defaults.background.primary,
						defaults.duration,
						defaults.outline,
						defaults.padding.input,
						defaults.rounded,
						defaults.shadow,
						defaults.transition,
						'hover:bg-primary-600 focus:bg-primary-600',
						'text-white',
						'font-semibold',
						'uppercase'
					)
				},
				card: {
					base: twMerge(
						defaults.background.base,
						defaults.duration,
						defaults.outline,
						defaults.padding.both,
						defaults.rounded,
						defaults.shadow,
						defaults.transition
					)
				},
				container: {
					base: 'max-w-7xl w-full mx-auto'
				},
				h1: { base: 'font-semibold text-5xl' },
				h2: { base: 'font-semibold text-4xl' },
				h3: { base: 'font-semibold text-3xl' },
				h4: { base: 'font-semibold text-2xl' },
				h5: { base: 'font-semibold text-xl' },
				h6: { base: 'font-semibold text-lg' }
			});

			if (browser) {
				const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
				const localStorageDarkMode =
					localStorage.getItem('darkMode') || prefersDarkMode === true ? 'true' : 'false';
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

<Div class="flex min-h-screen flex-col [@media(display-mode:standalone)]:min-h-lvh">
	{@render children()}
</Div>
