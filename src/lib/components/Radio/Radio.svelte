<script lang="ts">
	import { Check } from '@lucide/svelte';
	import { type Snippet } from 'svelte';
	import { type HTMLInputAttributes } from 'svelte/elements';
	import { Radio } from 'sveltewind/components';
	import { twMerge } from 'tailwind-merge';
	import { noopTransition, Div, Label, Card } from '$lib/components';
	import type { TransitionProps } from '$lib/components/types';
	import { theme as globalTheme, type Theme } from '$lib/theme';

	// Types
	type Props = HTMLInputAttributes & {
		children?: Snippet;
		class?: string;
		element?: HTMLInputElement | null;
		group?: any;
		handle?: Snippet;
		isVisible?: boolean;
		theme?: Theme;
		transition?: TransitionProps;
		value?: any;
		variants?: string[];
	};

	// $props
	let {
		children,
		class: className = '',
		element = $bindable(null),
		group = $bindable(''),
		handle,
		isVisible = $bindable(true),
		theme = globalTheme,
		transition = [noopTransition, {}],
		value = '',
		variants = [],
		...restProps
	}: Props = $props();

	// $state

	// $derived
	const classes = $derived(theme.resolve('radio', variants, className));

	// $effects
</script>

<Radio
	{...restProps}
	bind:element
	bind:isVisible
	bind:group
	class={classes}
	handle={handleWrapper}
	{transition}
	{value}
/>

{#snippet handleWrapper()}
	<Label class="relative cursor-pointer">
		<input bind:group class="sr-only" type="radio" {value} />
		{#if handle}
			{@render handle()}
		{:else}
			<Card
				class={twMerge(
					'py-3 lg:py-6',
					group === value ? 'outline-primary-600 dark:outline-primary-600' : undefined
				)}
			>
				{#if children}
					{@render children()}
				{/if}
			</Card>
		{/if}
		<Div
			class="absolute top-1 right-1 aspect-square rounded-full bg-primary-600 p-1 text-white"
			isVisible={group === value}
		>
			<Check class="size-3" />
		</Div>
	</Label>
{/snippet}
