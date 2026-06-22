<script lang="ts">
	import { Button, Card, Div, ProductOption, Radio, Select } from '$lib/components';
	import { Product } from '$lib/layouts';
	import { session } from '$lib/session/index.svelte';
	import { Minus, Plus } from '@lucide/svelte';

	// consts
	const onAdd = () => {
		session.add({
			description,
			options,
			quantity,
			type: 'Fastener / Attachment',
			unitPrice: 0,
			uom: 'EA'
		});
	};
	const items = [
		{ value: 'Diamond Clip', title: 'Diamond Clip' },
		{ value: 'Secure-A-Tie', title: 'Secure-A-Tie' },
		{ value: 'Tamper Seal', title: 'Tamper Seal' },
		{ value: 'Loose Wire', title: 'Loose Wire' }
	];
	const quantityOptions = new Array(100).fill(0).map((_, index) => ({
		label: ((index + 1) * 1000).toLocaleString(),
		value: (index + 1) * 1000
	}));
	const secureATieColors = ['Black', 'Clear', 'Red'];
	const tamperSealColors = ['Black', 'Blue', 'Green', 'Gray', 'Orange', 'Red', 'White', 'Yellow'];

	// $state
	let item = $state('Diamond Clip');
	let options: Record<string, any> = $state({});
	let quantity = $state(1000);

	// $effects
	$effect(() => {
		if (item === 'Diamond Clip') options = {};
		if (item === 'Secure-A-Tie') options = { color: 'Black' };
		if (item === 'Tamper Seal') options = { color: 'Black' };
		if (item === 'Loose Wire') options = {};
	});

	// $derived
	const description = $derived.by(() => {
		if (item === 'Diamond Clip') return item;
		if (item === 'Secure-A-Tie') return `${options?.color} Secure-A-Tie`;
		if (item === 'Tamper Seal') return `${options?.color} Tamper Seal`;
		return item;
	});
</script>

<Product {onAdd} title="Fasteners / Attachments">
	{#snippet productOptions()}
		<ProductOption number={1} title="Item" text="Choose the item">
			<Div class="grid grid-cols-2 gap-4 lg:flex">
				{#each items as { value, title }}
					<Radio bind:group={item} {value}>
						{title}
					</Radio>
				{/each}
			</Div>
		</ProductOption>
		<ProductOption number={2} title="Color" text="Choose the color">
			{#if item === 'Diamond Clip' || item === 'Loose Wire'}
				<Div class="grid grid-cols-1 gap-4 lg:flex">
					<Radio>N/A</Radio>
				</Div>
			{:else if item === 'Secure-A-Tie' && options.color}
				<Div class="grid grid-cols-3 gap-4 lg:flex">
					{#each secureATieColors as value}
						<Radio bind:group={options.color} {value}>
							{value}
						</Radio>
					{/each}
				</Div>
			{:else if item === 'Tamper Seal' && options.color}
				<Div class="grid grid-cols-4 gap-4 lg:flex">
					{#each tamperSealColors as value}
						<Radio bind:group={options.color} {value}>
							{value}
						</Radio>
					{/each}
				</Div>
			{/if}
		</ProductOption>

		<ProductOption number={3} title="Quantity" text={`Enter the quantity needed`}>
			<Div class="flex flex-col lg:flex-row lg:items-start lg:justify-between">
				<Card
					class="grid grid-cols-[fit-content(0px)_1fr_fit-content(0px)] divide-x divide-gray-200 p-0 lg:items-stretch dark:divide-gray-800"
				>
					<Div>
						<Button
							class="rounded-r-none"
							disabled={quantity < 2000 ? true : undefined}
							onclick={() => (quantity -= 1000)}
							variants={['ghost', 'icon']}
						>
							<Minus />
						</Button>
					</Div>
					<Select
						bind:value={quantity}
						class="rounded-none px-12 py-0 text-center text-2xl font-semibold shadow-none outline-0"
						options={quantityOptions}
					/>
					<Div>
						<Button
							class="rounded-l-none"
							disabled={quantity >= 100000 ? true : undefined}
							onclick={() => (quantity += 1000)}
							variants={['ghost', 'icon']}
						>
							<Plus />
						</Button>
					</Div>
				</Card>
			</Div>
		</ProductOption>
	{/snippet}
	{#snippet preview()}{/snippet}
</Product>
