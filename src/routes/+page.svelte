<script lang="ts">
	import { Button, Card, Container, Div, Field, Form, H1, Input, P, Span } from '$lib/components';
	import { CircleGauge, ShieldCheck, SlidersHorizontal } from '@lucide/svelte';
	import { register } from './data.remote';
	import { trapFocus } from 'sveltewind/attachments';
	import { slide } from '$lib/transitions';

	// const
	const icons = [
		{ Icon: CircleGauge, title: 'Fast', text: 'Build quotes in minutes' },
		{ Icon: SlidersHorizontal, title: 'Flexible', text: 'Configure products to fit needs' },
		{ Icon: ShieldCheck, title: 'Accurate', text: 'Reliable pricing you can trust' }
	];
</script>

<Container class="flex grow flex-col items-center justify-center py-3">
	<Div class="flex flex-col space-y-6 lg:flex-row lg:gap-4 lg:space-y-0">
		<Div class="flex flex-col space-y-6 lg:w-full lg:justify-center">
			<H1>Be the first to know!</H1>
			<P class="lg:max-w-md"
				>Our online quoting is quick and easy to build accurate product quotes. Configure, customize
				and price with confidence.</P
			>

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
		</Div>
		<Card class="space-y-6">
			<Span class="text-2xl font-semibold">Be the first to know when the lauch happens!</Span>
			<P class="text-sm">Join the early access list and we'll reach out as soon as it is ready.</P>
			<Span class="text-xl font-semibold text-primary-600">
				Receive 10% off for your feedback once we launch!
			</Span>
			<Form {@attach trapFocus} {...register} class="space-y-6">
				<Field label="Full Name">
					<Input {...register.fields.name.as('text')} required={true} />
				</Field>
				<Field label="Email">
					<Input {...register.fields.email.as('email')} required={true} />
				</Field>
				<Div
					class="flex flex-col"
					isVisible={(register.fields.allIssues() ?? []).length > 0}
					transition={[slide, { duration: 200 }]}
				>
					{#each register.fields.allIssues() as issue}
						<P class="text-primary-600">{issue.message}</P>
					{/each}
				</Div>
				<Button class="w-full whitespace-nowrap" type="submit">Join the early access list</Button>
			</Form>
		</Card>
	</Div>
</Container>
