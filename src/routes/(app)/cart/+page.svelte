<script lang="ts">
	import {
		A,
		Button,
		Card,
		Container,
		Div,
		P,
		RouteHeading,
		Span,
		Table,
		Tbody,
		Td,
		Th,
		Thead,
		Tr
	} from '$lib/components';
	import DataTable from '$lib/components/DataTable/DataTable.svelte';
	import { currency } from '$lib/format';
	import { session } from '$lib/session/index.svelte';
	import { ChevronLeft, Pencil, Trash } from '@lucide/svelte';
</script>

<Container class="flex flex-col divide-y divide-gray-200 py-3 dark:divide-gray-900">
	<RouteHeading
		class="pb-3"
		subTitle="Review your items and proceed to checkout"
		title="Your Cart"
	/>
	<Div class="flex py-3">
		<A
			class="flex items-center gap-2"
			href="/product-type"
			variants={['button.base', 'button.variant.ghost']}
		>
			<ChevronLeft class="size-4" />
			<Span>Continue Shopping</Span>
		</A>
	</Div>
	<Div class="py-3">
		{#if session.cart.length === 0}
			<P class="text-xs">Your cart is empty</P>
		{:else}
			<Card class="overflow-auto p-0">
				<Table>
					<Thead>
						<Tr>
							<Th />
							<Th class="w-full">Item</Th>
							<Th>Qty</Th>
							<Th>Unit Price</Th>
							<Th>Total</Th>
						</Tr>
					</Thead>
					<Tbody>
						{#each session.cart as item, itemIndex}
							<Tr class="border-b border-gray-200 last-of-type:border-b-0 dark:border-gray-800">
								<Td>
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
								</Td>
								<Td>
									<Div class="flex flex-col space-y-4">
										<Span class="font-semibold">{item.type}</Span>
										<P class="text-xs">{item.description}</P>
									</Div>
								</Td>
								<Td class="text-right">{item.quantity.toLocaleString()}</Td>
								<Td class="text-right">{currency(item.unitPrice)}</Td>
								<Td class="text-right">{currency(item.unitPrice * item.quantity)}</Td>
							</Tr>
						{/each}
					</Tbody>
				</Table>
			</Card>
		{/if}
	</Div>
	<!-- {#each session.cart as item, itemIndex}
		<Div class="flex gap-4 py-3">
			<Div class="flex flex-col space-y-4">
				<Span class="font-semibold">{item.type}</Span>
				<P class="text-xs">{item.description}</P>
				<Span class="text-xl font-semibold">Qty: {item.quantity.toLocaleString()}</Span>
			</Div>
			<Div class="flex flex-col items-end justify-between">
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
			</Div>
		</Div>
	{/each} -->
</Container>
