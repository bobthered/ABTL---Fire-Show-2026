<script>
	import { A, Container, Div, H1, H2, P, Span } from '$lib/components';
	import { ArrowRight } from '@lucide/svelte';

	// consts
	const productTypes = [
		{ href: '/product-type/tags', title: 'Tags', text: 'Inspection, Service and Identification' },
		{ href: '/product-type/labels', title: 'Labels', text: 'Sprinkler, E-Light, Service and More' },
		{ href: '/product-type/collars', title: 'Collars', text: 'Three Different Sizes' },
		{
			href: '/product-type/fasteners-attachments',
			title: 'Fasteners / Attachments',
			text: 'Diamond clips, Secur-A-Ties, Tamper Seals and Loose Wire'
		}
	];
</script>

<Container class="flex flex-col space-y-6">
	<Div class="flex flex-col space-y-2">
		<H1>Product Type</H1>
		<Div class="h-1 w-12 bg-primary-600" />
	</Div>
	<P>Let's get started</P>
	<Div class="flex flex-col">
		<H2 class="text-base uppercase">Select Product Type</H2>
		<P>Choose one to begin</P>
	</Div>
	<Div class="grid gap-4 md:grid-cols-4">
		{#each productTypes as { href, title, text }}
			<A class="group lg:p-0 lg:hover:scale-105" {href} variants={['card.base']}>
				<Div class="flex grow items-center lg:flex-col lg:items-end lg:space-y-6 lg:p-6">
					<Div class="flex grow flex-col lg:w-full lg:items-center lg:space-y-4">
						<Span class="text-xl font-semibold uppercase lg:text-center">{title}</Span>
						<P class="text-xs lg:text-center">{text}</P>
					</Div>
					<ArrowRight class="size-8 shrink-0 text-primary-600" />
				</Div>
			</A>
		{/each}
	</Div>
</Container>
