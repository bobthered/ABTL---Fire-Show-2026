<script lang="ts">
	import { type Snippet } from 'svelte';
	import { type HTMLAttributes } from 'svelte/elements';
	import { noopTransition, Div, Span, P } from '$lib/components';
	import type { TransitionProps } from '$lib/components/types';
	import { theme as globalTheme, type Theme } from '$lib/theme';

	// Types
	type Props = HTMLAttributes<HTMLDivElement> & {
		children?: Snippet;
		class?: string;
		element?: HTMLDivElement | null;
		isVisible?: boolean;
		number?: number;
		text?: string;
		theme?: Theme;
		title?: string;
		transition?: TransitionProps;
		variants?: string[];
	};

	// $props
	let {
		children,
		class: className = '',
		element = $bindable(null),
		isVisible = $bindable(true),
		number = 1,
		text = '',
		theme = globalTheme,
		title = '',
		transition = [noopTransition, {}],
		variants = [],
		...restProps
	}: Props = $props();

	// $state

	// $derived
	const classes = $derived(theme.resolve('productOption', variants, className));

	// $effects
</script>

<Div {...restProps} bind:element bind:isVisible class={classes} {transition}>
	<Div class="size-6 rounded-full bg-primary-600 text-center text-white">{number}</Div>
	<Div class="flex flex-col space-y-6">
		<Div class="flex flex-col">
			<Span class="font-semibold uppercase">{title}</Span>
			<P class="text-xs">{text}</P>
		</Div>
		{#if children}
			{@render children()}
		{/if}
	</Div>
</Div>
