<script lang="ts">
	import {
		A,
		Button,
		Card,
		Container,
		Div,
		Field,
		Form,
		H1,
		Input,
		P,
		Span
	} from '$lib/components';
	import { Check, CircleGauge, Mail, ShieldCheck, SlidersHorizontal } from '@lucide/svelte';

	// const
	const icons = [
		{ Icon: CircleGauge, title: 'Fast', text: 'Build quotes in minutes' },
		{ Icon: SlidersHorizontal, title: 'Flexible', text: 'Configure products to fit needs' },
		{ Icon: ShieldCheck, title: 'Accurate', text: 'Reliable pricing you can trust' }
	];
</script>

<Container class="flex grow flex-col items-center justify-center space-y-6 py-3">
	<Div class="flex flex-col items-center space-y-6 lg:w-full lg:justify-center">
		<Check class="size-24 text-primary-600" />
		<H1>You're all set!</H1>
		<Span class="text-center font-semibold">Thank you for joining the early access!</Span>
		<P class="text-center lg:max-w-md"
			>We've received your information and will be in touch once we're ready for your feedback</P
		>

		<Card class="items-center space-y-6">
			<Mail class="size-12 text-primary-600" />
			<Div class="flex flex-col space-y-6">
				<Span class="text-center font-semibold">Keep an eye on your inbox</Span>
				<P class="text-center">We'll send you updates, sneak peaks and access once availble.</P>
			</Div>
		</Card>
	</Div>
	<A class="w-full text-center md:w-auto" href="/" variants={['button.base']}
		>Back to registration</A
	>
</Container>
