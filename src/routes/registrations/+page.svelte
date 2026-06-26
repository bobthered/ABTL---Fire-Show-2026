<script lang="ts">
	import {
		Button,
		Card,
		Container,
		Form,
		Input,
		Table,
		Tbody,
		Td,
		Th,
		Thead,
		Tr
	} from '$lib/components';
	import { Trash } from '@lucide/svelte';
	import { deleteRegistration, getRegistrations } from '../data.remote';

	let registrations = getRegistrations();
</script>

<Container class="flex grow flex-col items-center justify-center py-3">
	<Card class="max-w-full overflow-auto p-0">
		<Table>
			<Thead>
				<Tr>
					<Th />
					<Th>Name</Th>
					<Th>Email</Th>
					<Th>Created At</Th>
				</Tr>
			</Thead>
			<Tbody>
				{#if registrations.current}
					{#each registrations.current as registration, index}
						{@const deleteRow = deleteRegistration.for(index)}
						<Tr>
							<Td class="px-3">
								<Form {...deleteRow}>
									<Input name="_id" type="hidden" value={registration._id} />
									<Input name="index" type="hidden" value={index} />
									<Button
										class="text-primary-600 hover:bg-primary-600/10 focus:bg-primary-600/10 dark:text-primary-600 dark:hover:bg-primary-600/10 dark:focus:bg-primary-600/10"
										type="submit"
										variants={['icon', 'ghost']}
									>
										<Trash />
									</Button>
								</Form>
							</Td>
							<Td class="whitespace-nowrap">{registration.name}</Td>
							<Td class="whitespace-nowrap">{registration.email}</Td>
							<Td class="whitespace-nowrap"
								>{registration.createdAt.toLocaleString('en-US', {
									dateStyle: 'short',
									timeStyle: 'short'
								})}</Td
							>
						</Tr>
					{/each}
				{/if}
			</Tbody>
		</Table>
	</Card>
</Container>
