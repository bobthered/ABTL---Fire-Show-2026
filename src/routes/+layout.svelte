<script lang="ts">
	import { untrack, type Snippet } from 'svelte';
	import { theme } from 'sveltewind/theme';
	import { default as defaultTheme } from 'sveltewind/themes';
	import { twMerge } from 'tailwind-merge';
	import { browser } from '$app/environment';
	import { Div } from '$lib/components';

	import './layout.css';
	import { staggerReveal } from '$lib/attachments';

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
					primary: 'bg-primary-600'
				},
				duration: 'duration-200',
				outline: 'outline-2 outline-transparent focus:outline-primary-600/30',
				padding: {
					both: 'p-6',
					input: 'px-6 py-3',
					x: 'px-6',
					y: 'py-6'
				},
				ring: 'inset-ring inset-ring-gray-200 dark:inset-ring-gray-800 focus:inset-ring-primary-600',
				rounded: 'rounded-2xl',
				shadow: 'shadow-sm dark:shadow-black',
				transition: 'transition'
			};

			theme.update.theme({
				a: {
					base: 'no-underline'
				},
				button: {
					base: twMerge(
						defaults.background.primary,
						defaults.duration,
						defaults.outline,
						defaults.padding.input,
						defaults.ring,
						defaults.rounded,
						defaults.shadow,
						defaults.transition,
						'cursor-pointer',
						'hover:bg-primary-700 focus:bg-primary-700',
						'text-white',
						'font-semibold',
						'uppercase'
					),
					variants: {
						icon: 'px-0 py-0 size-12',
						ghost: twMerge(
							'bg-transparent hover:bg-current/10 focus:bg-current/10 text-current shadow-none inset-ring-transparent dark:inset-ring-transparent'
						),
						outline: twMerge(
							twMerge(defaults.outline, 'outline-primary-600 dark:outline-primary-600'),
							'background-transparent',
							'shadow-none',
							'text-primary-600'
						),
						'outline-white': twMerge(
							twMerge(defaults.outline, 'outline-white dark:outline-white'),
							'background-transparent',
							'shadow-none',
							'text-white'
						)
					}
				},
				card: {
					base: twMerge(
						defaults.background.base,
						defaults.duration,
						defaults.outline,
						defaults.padding.both,
						defaults.ring,
						defaults.rounded,
						defaults.shadow,
						defaults.transition,
						'flex flex-col'
					)
				},
				container: {
					base: 'max-w-7xl w-full mx-auto'
				},
				field: { base: 'flex flex-col' },
				h1: { base: 'font-semibold text-5xl' },
				h2: { base: 'font-semibold text-4xl' },
				h3: { base: 'font-semibold text-3xl' },
				h4: { base: 'font-semibold text-2xl' },
				h5: { base: 'font-semibold text-xl' },
				h6: { base: 'font-semibold text-lg' },
				header: { base: twMerge(defaults.background.primary, 'py-1 border-0 static') },
				input: {
					base: twMerge(
						defaults.background.base,
						defaults.duration,
						defaults.outline,
						defaults.padding.input,
						defaults.ring,
						defaults.rounded,
						defaults.shadow,
						defaults.transition,
						'appearance-none'
					)
				},
				p: { base: 'text-gray-500' },
				productOption: { base: 'col-span-2 grid grid-cols-subgrid py-3' },
				routeHeading: { base: 'flex flex-col space-y-2' },
				select: {
					base: twMerge(
						defaults.background.base,
						defaults.duration,
						defaults.outline,
						defaults.padding.input,
						defaults.rounded,
						defaults.shadow,
						defaults.transition,
						'appearance-none'
					)
				},
				spinner: { base: 'size-6' },
				td: { base: twMerge(defaults.padding.input) },
				th: {
					base: twMerge(
						defaults.padding.input,
						'text-sm lg:text-base border-b border-gray-200 dark:border-gray-800'
					)
				}
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

<Div
	{@attach staggerReveal}
	class="flex min-h-screen flex-col [@media(display-mode:standalone)]:min-h-lvh"
>
	{@render children()}
</Div>
