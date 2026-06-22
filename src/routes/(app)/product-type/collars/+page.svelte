<script lang="ts">
	import { Minus, Plus } from '@lucide/svelte';
	import { Button, Card, Div, ProductOption, Radio, Select } from '$lib/components';
	import { Product } from '$lib/layouts';
	import { Collar } from '$lib/previews';
	import { session } from '$lib/session/index.svelte';

	// consts
	const colors = [
		{ value: 'Small (Green)', hex: '#109f10' },
		{ value: 'Medium (Gray)', hex: '#9FA1A4' },
		{ value: 'Large (Blue)', hex: '#141c70' }
	];
	const onAdd = () => {
		session.add({
			description,
			options: {},
			quantity,
			type: 'Collar',
			unitPrice: 0,
			uom: 'EA'
		});
	};
	const quantityOptions = new Array(100)
		.fill(0)
		.map((_, index) => ({ label: ((index + 1) * 100).toLocaleString(), value: index + 1 }));

	// $state
	let color = $state('Small (Green)');
	let rolls = $state(1);

	// $derived
	const description = $derived(`${color}`);
	const quantity = $derived(rolls * 100);
</script>

<Product {onAdd} title="Collars">
	{#snippet productOptions()}
		<ProductOption number={1} title="Material" text="Choose the size/color">
			<Div class="grid grid-cols-3 gap-4 lg:flex">
				{#each colors as { value }}
					<Radio bind:group={color} {value}>
						{value}
					</Radio>
				{/each}
			</Div>
		</ProductOption>
		<ProductOption number={2} title="Quantity" text={`Enter the quantity of collars needed`}>
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
							disabled={rolls >= 100 ? true : undefined}
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
		<Collar class="w-full" {color} />
	{/snippet}
</Product>
