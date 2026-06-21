<script lang="ts">
	import {
		Button,
		Card,
		Container,
		Div,
		H1,
		P,
		ProductOption,
		Radio,
		Select,
		Span,
		Tag
	} from '$lib/components';
	import { session } from '$lib/session/index.svelte';
	import { Minus, Plus } from '@lucide/svelte';

	// consts
	const booleans = [
		{ value: true, title: 'Yes' },
		{ value: false, title: 'No' }
	];
	const materials = [
		{ value: 'Paper', title: 'Paper' },
		{ value: 'DuraPaper', title: 'DuraPaper' },
		{ value: 'Polyart', title: 'Polyart' },
		{ value: 'Tyvek', title: 'Tyvek' }
	];
	const materialColors = [
		{ value: 'Blue (Dark)', hex: '#6789C6' },
		{ value: 'Blue (Light)', hex: '#A7CBE2' },
		{ value: 'Brown', hex: '#CF8D52' },
		{ value: 'Buff', hex: '#EBD896' },
		{ value: 'Gray', hex: '#BCBEC0' },
		{ value: 'Green (Dark)', hex: '#2BB34A' },
		{ value: 'Green (Light)', hex: '#83C77C' },
		{ value: 'Ivory', hex: '#F5E3A1' },
		{ value: 'Lilac', hex: '#D3A6CD' },
		{ value: 'Manila', hex: '#FFE1B1' },
		{ value: 'Orange', hex: '#F47C41' },
		{ value: 'Pink', hex: '#F6A0A6' },
		{ value: 'Red', hex: '#ED1D2F' },
		{ value: 'Salmon', hex: '#FBC09E' },
		{ value: 'White', hex: '#FFFFFF' },
		{ value: 'Yellow', hex: '#FFDE3B' },
		{ value: 'Fluorescent Green', hex: '#4DB748' },
		{ value: 'Fluorescent Orange', hex: '#F47521' },
		{ value: 'Fluorescent Pink', hex: '#EC008C' },
		{ value: 'Fluorescent Red', hex: '#ED1D24' },
		{ value: 'Fluorescent Yellow', hex: '#F2EA01' }
	];
	const printQualities = [
		{ value: 'Economy', title: 'Economy' },
		{ value: 'Premium', title: 'Premium' }
	];
	const quantityOptions = new Array(50)
		.fill(0)
		.map((_, index) => ({ label: ((index + 1) * 1000).toLocaleString(), value: index + 1 }));

	// $state
	let boxes = $state(1);
	let eyelet = $state(false);
	let material = $state('Paper');
	let materialColor = $state('White');
	let printQuality = $state('Economy');
	let wired = $state(false);

	// $derived
	const description = $derived(
		`${materialColor} ${material}, ${printQuality} Print Quality, Eyelet: ${eyelet ? 'Yes' : 'No'}, Wired: ${wired ? 'Yes' : 'No'}`
	);
	const materialHex = $derived(
		materialColors.find((obj) => obj.value === materialColor)?.hex ?? '#FFFFFF'
	);
	const materialColorOptions = $derived(
		materialColors.map((obj) => ({ label: obj.value, value: obj.value }))
	);
	const quantity = $derived(boxes * 1000);
</script>

<Container>
	<Div
		class="relative flex divide-gray-200 lg:max-h-[calc(100vh_-_var(--topElementOffsetHeight))] lg:divide-x lg:pr-6 dark:divide-gray-900"
	>
		<Div
			class="grid w-full grow grid-cols-[fit-content(0px)_1fr] gap-x-2 divide-y divide-gray-200 py-6 lg:w-auto lg:overflow-auto lg:pr-6 dark:divide-gray-900"
		>
			<Div class="col-span-2 flex flex-col pb-3">
				<Div class="flex flex-col space-y-2">
					<H1>Tags</H1>
					<Div class="h-1 w-12 bg-primary-600" />
				</Div>
				<P class="whitespace-nowrap">Let's get started</P>
			</Div>
			<ProductOption number={1} title="Material" text="Choose the tag material">
				<Div class="grid grid-cols-2 gap-4 lg:flex">
					{#each materials as { value, title }}
						<Radio bind:group={material} {value}>
							{title}
						</Radio>
					{/each}
				</Div>
			</ProductOption>
			<ProductOption number={2} title="Print Quality" text="Choose the print quality">
				<Div class="grid grid-cols-2 gap-4 lg:flex">
					{#each printQualities as { value, title }}
						<Radio bind:group={printQuality} {value}>
							{title}
						</Radio>
					{/each}
				</Div>
			</ProductOption>
			<ProductOption
				number={3}
				title="Material Color"
				text="Choose your material color from 21 options"
			>
				<Div class="flex gap-4">
					<Select bind:value={materialColor} options={materialColorOptions} />
				</Div>
			</ProductOption>
			<ProductOption number={4} title="Eyelet" text="Add a metal eyelet for reinforcement">
				<Div class="grid grid-cols-2 gap-4 lg:flex">
					{#each booleans as { value, title }}
						<Radio bind:group={eyelet} {value}>{title}</Radio>
					{/each}
				</Div>
			</ProductOption>
			<ProductOption number={5} title="Wired" text={`Include a 12" 26 guage wire`}>
				<Div class="grid grid-cols-2 gap-4 lg:flex">
					{#each booleans as { value, title }}
						<Radio bind:group={wired} {value}>{title}</Radio>
					{/each}
				</Div>
			</ProductOption>
			<ProductOption number={6} title="Quantity" text={`Enter the quantity of tags needed`}>
				<Div class="flex flex-col lg:flex-row lg:items-start lg:justify-between">
					<Card
						class="grid grid-cols-[fit-content(0px)_1fr_fit-content(0px)] divide-x divide-gray-200 p-0 lg:items-stretch dark:divide-gray-800"
					>
						<Div>
							<Button
								class="rounded-r-none"
								disabled={boxes < 2 ? true : undefined}
								onclick={() => boxes--}
								variants={['ghost', 'icon']}
							>
								<Minus />
							</Button>
						</Div>
						<Select
							bind:value={boxes}
							class="rounded-none px-12 text-center text-2xl font-semibold shadow-none outline-0"
							options={quantityOptions}
						/>
						<Div>
							<Button
								class="rounded-l-none"
								disabled={boxes >= 50 ? true : undefined}
								onclick={() => boxes++}
								variants={['ghost', 'icon']}
							>
								<Plus />
							</Button>
						</Div>
					</Card>
				</Div>
			</ProductOption>
			<Div class="col-span-2 grid grid-cols-subgrid py-6 lg:flex">
				<Button
					class="col-span-2"
					onclick={() => {
						session.add({
							description,
							options: { eyelet, material, materialColor, printQuality, wired },
							quantity,
							type: 'Tag',
							unitPrice: 0,
							uom: 'EA'
						});
					}}
				>
					Add to Cart
				</Button>
			</Div>
		</Div>
		<Div class="hidden flex-col space-y-4 py-6 pl-6 lg:flex">
			<Span class="font-semibold uppercase">Preview</Span>
			<Tag class="w-full" {eyelet} {materialColor} {printQuality} />
		</Div>
	</Div>
</Container>
