<script lang="ts">
	import { Button, Container, Div, H1, P, RouteHeading, Span, UnderlineH1 } from '$lib/components';
	import type { Snippet } from 'svelte';

	// types
	type Props = {
		onAdd: () => void;
		preview: Snippet;
		productOptions: Snippet;
		title: string;
	};

	// $props()
	let { onAdd, preview, productOptions, title }: Props = $props();
</script>

<Container>
	<Div
		class="relative flex items-start divide-gray-200 lg:max-h-[calc(100vh_-_var(--topElementOffsetHeight))] lg:divide-x lg:pr-6 dark:divide-gray-900"
	>
		<Div
			class="grid w-full grow grid-cols-[fit-content(0px)_1fr] gap-x-2 divide-y divide-gray-200 py-6 lg:w-auto lg:overflow-auto lg:pr-6 dark:divide-gray-900"
		>
			<RouteHeading class="col-span-2 py-3" subTitle="Let's get started" {title} />
			{@render productOptions()}
			<Div class="col-span-2 grid grid-cols-subgrid py-6 lg:flex">
				<Button class="col-span-2" onclick={onAdd}>Add to Cart</Button>
			</Div>
		</Div>
		<Div class="hidden flex-col space-y-4 py-6 pl-6 lg:flex">
			<Span class="font-semibold uppercase">Preview</Span>
			{@render preview()}
		</Div>
	</Div>
</Container>
