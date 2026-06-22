<script lang="ts">
	import { type Snippet } from 'svelte';
	import { type HTMLAttributes } from 'svelte/elements';
	import { noopTransition, Div, UnderlineH1, P } from '$lib/components';
	import type { TransitionProps } from '$lib/components/types';
	import { theme as globalTheme, type Theme } from '$lib/theme';

	// Types
	type Props = HTMLAttributes<HTMLDivElement> & {
		children?: Snippet;
		class?: string;
		element?: HTMLDivElement | null;
		isVisible?: boolean;
		subTitle?: string;
		title?: string;
		theme?: Theme;
		transition?: TransitionProps;
		variants?: string[];
	};

	// $props
	let {
		children,
		class: className = '',
		element = $bindable(null),
		isVisible = $bindable(true),
		subTitle = '',
		title = '',
		theme = globalTheme,
		transition = [noopTransition, {}],
		variants = [],
		...restProps
	}: Props = $props();

	// $state

	// $derived
	const classes = $derived(theme.resolve('routeHeading', variants, className));

	// $effects
</script>

<Div {...restProps} bind:element bind:isVisible class={classes} {transition}>
	{#if children}
		{@render children()}
	{:else}
		<UnderlineH1>{title}</UnderlineH1>
		<P class="text-xs whitespace-nowrap">{subTitle}</P>
	{/if}
</Div>
