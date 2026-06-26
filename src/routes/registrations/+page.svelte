<script lang="ts">
	import { Card, Container, Table, Tbody, Td, Th, Thead, Tr } from '$lib/components';
	import { getRegistrations } from '../data.remote';

	let registrations = getRegistrations();
</script>

<Container class="flex grow flex-col items-center justify-center py-3">
	<Card class="p-0">
		<Table>
			<Thead>
				<Tr>
					<Th>Name</Th>
					<Th>Email</Th>
					<Th>Created At</Th>
				</Tr>
			</Thead>
			<Tbody>
				{#if registrations.current}
					{#each registrations.current as registration}
						<Tr>
							<Td>{registration.name}</Td>
							<Td>{registration.email}</Td>
							<Td
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
