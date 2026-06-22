<script lang="ts">
	import { ArrowRight, ChevronRight, Pencil, ShoppingCart, Trash, X } from '@lucide/svelte';
	import { untrack, type Snippet } from 'svelte';
	import { page } from '$app/state';
	import { A, Button, Card, Container, Div, Header, Logo, P, Span } from '$lib/components';
	import { session } from '$lib/session/index.svelte';
	import { clickOutside, portal } from '$lib/attachments';
	import { dropdown, fade } from '$lib/transitions';
	import { currency } from '$lib/format';
	import { twMerge } from 'tailwind-merge';

	// Types
	type Props = {
		children: Snippet<[]>;
	};

	// consts
	const updateCartButtonRect = () => {
		if (cartButtonElement) {
			cartButtonRect = cartButtonElement.getBoundingClientRect();
		}
	};

	// $props()
	let { children }: Props = $props();

	// $state
	let cartButtonElement: HTMLButtonElement | null = $state(null);
	let cartButtonRect: DOMRect | null = $state(null);
	let isCartOpen = $state(false);
	let topElementOffsetHeight = $state(0);

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
	const cartSubtotal = $derived(
		session.cart.reduce((total, item) => total + item.quantity * item.unitPrice, 0)
	);

	// $effects
	$effect(() => {
		untrack(() => {
			updateCartButtonRect();
		});
	});
</script>

<svelte:window onresize={updateCartButtonRect} />
<Div class="relative flex grow flex-col">
	<div bind:offsetHeight={topElementOffsetHeight} class="sticky top-0 z-10">
		<Header>
			<Container class="flex flex-row items-center justify-between">
				<Logo class="h-10" fill={{ primary: 'fill-white', secondary: 'fill-white' }} />
				<Div class="relative z-20">
					<Button bind:element={cartButtonElement} onclick={() => (isCartOpen = !isCartOpen)}>
						<Div class="flex items-center gap-4">
							<ShoppingCart />
							<Span>Cart ({session.cart.length})</Span>
						</Div>
					</Button>
					<Card
						{@attach portal}
						class="fixed top-0 z-999 flex w-[calc(100vw_-_3rem)] max-w-[calc(100vw_-_3rem)] -translate-x-full flex-col divide-y divide-gray-200 lg:w-auto dark:divide-gray-800"
						isVisible={isCartOpen}
						transition={[dropdown]}
						style="left: {(cartButtonRect?.left ?? 0) +
							(cartButtonRect?.width ?? 0)}px; margin-top:{(cartButtonRect?.top ?? 0) +
							(cartButtonRect?.height ?? 0) +
							4}px"
					>
						<Div class="flex items-center justify-between gap-4 pb-3">
							<Span class="text-xl font-semibold whitespace-nowrap uppercase">Your cart</Span>
						</Div>
						{#if session.cart.length === 0}
							<P class="pt-3 text-xs whitespace-nowrap">Your cart is empty</P>
						{:else}
							<Div class="flex flex-col">
								<Div
									class="-mx-6 grid max-h-[20rem] grid-cols-[1fr_fit-content(0px)] divide-y divide-gray-200 overflow-auto px-6 dark:divide-gray-800"
								>
									{#each session.cart as item, itemIndex}
										<Div class="col-span-2 grid grid-cols-subgrid py-3">
											<Div class="flex flex-col space-y-4">
												<Span class="font-semibold">{item.type}</Span>
												<P class="min-w-50 text-xs">{item.description}</P>
												<P class="font-semibold text-current"
													>Qty: {item.quantity.toLocaleString()}</P
												>
											</Div>
											<Div class="flex flex-col justify-between gap-4">
												<Card class="flex-row divide-x divide-gray-200 p-0 dark:divide-gray-800">
													<Button
														class="size-10 rounded-r-none text-red-600 hover:bg-red-600/10 focus:bg-red-600/10 dark:text-red-600"
														onclick={() => {
															session.remove(itemIndex);
														}}
														variants={['icon', 'ghost']}
													>
														<Trash class="size-4" />
													</Button>
													<Button class="size-10 rounded-l-none" variants={['icon', 'ghost']}>
														<Pencil class="size-4" />
													</Button>
												</Card>
												<Span class="text-right font-semibold">
													{currency(item.unitPrice * item.quantity)}
												</Span>
											</Div>
										</Div>
									{/each}
								</Div>
							</Div>
							<Div class="flex flex-col space-y-2 py-3">
								<Div class="flex items-center justify-between gap-4">
									<Span class="whitespace-nowrap"
										>Subtotal ({session.cart.length} item{session.cart.length === 1
											? ''
											: 's'})</Span
									>
									<Span class="text-right font-semibold">
										{currency(cartSubtotal)}
									</Span>
								</Div>
								<P class="text-xs">Shipping, handling and taxes calculated at checkout</P>
							</Div>
							<Div class="flex flex-col space-y-2 pt-3">
								<A
									class="text-center"
									href="/cart"
									onclick={() => (isCartOpen = false)}
									variants={['button.base']}>Checkout</A
								>
								<Button onclick={() => (isCartOpen = false)} variants={['ghost']}>
									Continue Shopping
								</Button>
							</Div>
						{/if}
					</Card>
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
	</div>
	<Div
		class="relative flex grow flex-col justify-center"
		style="--topElementOffsetHeight: {topElementOffsetHeight}px;"
	>
		{@render children()}
		<Div
			class={twMerge(
				'absolute top-0 left-0 h-full w-full backdrop-blur transition duration-200',
				isCartOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
			)}
			onclick={() => (isCartOpen = false)}
		/>
	</Div>
</Div>
