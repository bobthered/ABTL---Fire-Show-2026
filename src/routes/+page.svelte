<script lang="ts">
	import { CircleGauge, ShieldCheck, SlidersHorizontal } from '@lucide/svelte';
	import { A, Container, Div, H1, Logo, P, Span } from '$lib/components';
	import { session } from '$lib/session/index.svelte';
	import { untrack } from 'svelte';

	// const
	const icons = [
		{ Icon: CircleGauge, title: 'Fast', text: 'Build quotes in minutes' },
		{ Icon: SlidersHorizontal, title: 'Flexible', text: 'Configure products to fit needs' },
		{ Icon: ShieldCheck, title: 'Accurate', text: 'Reliable pricing you can trust' }
	];

	// $effects
	$effect(() => {
		untrack(() => {
			session.reset();
		});
	});
</script>

<Div class="relative flex grow flex-col">
	<Div
		class="absolute top-0 right-0 hidden h-full w-[40%] items-center justify-center bg-gray-100 md:flex"
	>
		<Logo
			class="w-50"
			fill={{
				primary: 'fill-[#8A181D]',
				secondary: 'fill-[#282D5B]'
			}}
		/>
	</Div>
	<Container class="flex grow flex-col items-start justify-center space-y-12">
		<Div class="flex flex-col space-y-4">
			<H1 class="text-6xl">Welcome!</H1>
			<Div class="h-1 w-18 bg-primary-600" />
		</Div>
		<P class="md:max-w-sm">
			Our online quoting is quick and easy to build accurate product quotes. Configure, customize
			and price with confidence.
		</P>
		<Div class="grid grid-cols-3 divide-x divide-gray-200 md:max-w-md dark:divide-gray-800">
			{#each icons as { Icon, title, text }}
				<Div
					class="row-span-3 grid grid-cols-1 grid-rows-subgrid place-items-center gap-2 px-6 first-of-type:pl-0 last-of-type:pr-0"
				>
					<Icon class="size-12 text-primary-600" />
					<Span class="leading-[1em] font-semibold uppercase">{title}</Span>
					<P class="text-center text-xs text-gray-500">{text}</P>
				</Div>
			{/each}
		</Div>
		<A
			class="w-full px-18 py-6 text-center text-3xl md:w-auto md:px-24 md:py-6"
			href="/choose-product"
			variants={['button.base']}>Get Started</A
		>
	</Container>
</Div>
