<script lang="ts">
	import { ArrowRight, ChevronRight, ShoppingCart } from '@lucide/svelte';
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import { A, Button, Container, Div, Header, Logo, Span } from '$lib/components';

	// Types
	type Props = {
		children: Snippet<[]>;
	};

	// $props()
	let { children }: Props = $props();

	// $derived
	const breadcrumbs = $derived(
		page.url.pathname
			.slice(1)
			.split('/')
			.map((slug, index, array) => {
				const href = `/${array.slice(0, index + 1).join('/')}`;
				const label = slug
					.split('-')
					.map((word) => word[0].toUpperCase() + word.slice(1))
					.join(' ');
				return { href, label };
			})
	);
</script>

<Div class="relative flex grow flex-col">
	<Div class="sticky top-0 z-10">
		<Header class="text-white">
			<Container class="flex flex-row items-center justify-between">
				<Logo class="h-10" fill={{ primary: 'fill-white', secondary: 'fill-white' }} />
				<Div>
					<Button>
						<Div class="flex items-center gap-4">
							<ShoppingCart />
							<Span>Cart (0)</Span>
						</Div>
					</Button>
				</Div>
			</Container>
		</Header>
		<Header class="border-b border-gray-200 bg-gray-50 dark:border-gray-900 dark:bg-gray-950">
			<Container class="flex items-center">
				{#each breadcrumbs as { href, label }, index}
					<A
						class="normal-case first-of-type:-ml-6"
						{href}
						variants={['button.base', 'button.variant.ghost']}
					>
						{label}
					</A>
					{#if index < breadcrumbs.length - 1}
						<ChevronRight class="size-4" />
					{/if}
				{/each}
			</Container>
		</Header>
	</Div>
	<Div class="flex grow flex-col justify-center py-6">
		{@render children()}
	</Div>
</Div>
