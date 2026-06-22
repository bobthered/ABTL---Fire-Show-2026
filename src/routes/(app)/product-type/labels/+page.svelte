<script lang="ts">
	import { Minus, Plus } from '@lucide/svelte';
	import { Button, Card, Div, ProductOption, Radio, Select } from '$lib/components';
	import { Product } from '$lib/layouts';
	import { Label } from '$lib/previews';
	import { session } from '$lib/session/index.svelte';

	// consts
	const onAdd = () => {
		session.add({
			description,
			options: {},
			quantity,
			type: 'Label',
			unitPrice: 0,
			uom: 'EA'
		});
	};
	const quantityOptions = new Array(200)
		.fill(0)
		.map((_, index) => ({ label: ((index + 1) * 250).toLocaleString(), value: index + 1 }));

	// $state
	let rolls = $state(1);

	// $derived
	const description = $derived(``);
	const quantity = $derived(rolls * 250);
</script>

<Product {onAdd} title="Labels">
	{#snippet productOptions()}
		<ProductOption number={1} title="Quantity" text={`Enter the quantity of labels needed`}>
			<Div class="flex flex-col lg:flex-row lg:items-start lg:justify-between">
				<Card
					class="grid grid-cols-[fit-content(0px)_1fr_fit-content(0px)] divide-x divide-gray-200 p-0 lg:items-stretch dark:divide-gray-800"
				>
					<Div>
						<Button
							class="rounded-r-none"
							disabled={rolls < 2 ? true : undefined}
							onclick={() => rolls--}
							variants={['ghost', 'icon']}
						>
							<Minus />
						</Button>
					</Div>
					<Select
						bind:value={rolls}
						class="rounded-none px-12 py-0 text-center text-2xl font-semibold shadow-none outline-0"
						options={quantityOptions}
					/>
					<Div>
						<Button
							class="rounded-l-none"
							disabled={rolls >= 200 ? true : undefined}
							onclick={() => rolls++}
							variants={['ghost', 'icon']}
						>
							<Plus />
						</Button>
					</Div>
				</Card>
			</Div>
		</ProductOption>
	{/snippet}
	{#snippet preview()}
		<Label class="w-full" />
	{/snippet}
</Product>
