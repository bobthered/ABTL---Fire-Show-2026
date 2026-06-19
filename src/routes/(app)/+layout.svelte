<script lang="ts">
	import { Button, Container, Div, Header, Span } from '$lib/components';
	import { ShoppingCart } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	// Types
	type Props = {
		children: Snippet<[]>;
	};

	// $props()
	let { children }: Props = $props();
</script>

<Div class="relative flex grow flex-col">
	<Header class="sticky top-0 text-white">
		<Container class="flex flex-row items-center justify-between">
			<Span>Fire Suppression Quote Tool</Span>
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
	<Div class="flex grow flex-col justify-center py-6">
		{@render children()}
	</Div>
</Div>
