<script lang="ts">
	import { Plus, Search, Settings, Trash, TriangleAlert } from '@lucide/svelte';
	import { untrack } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { Button, Card, Div, Field, Form, Input, Span } from '$lib/components';
	import { clickOutside } from '$lib/attachments';
	import type { Props, ResolvedColumn, Row } from './types';
	import { dropdown } from '$lib/transitions';

	// Types
	type ToolbarProps = Pick<
		Props<Row>,
		| 'isCreatable'
		| 'isDeletable'
		| 'isPageLengthEditable'
		| 'isSearchable'
		| 'onCreate'
		| 'onDelete'
		| 'pageLength'
		| 'rows'
		| 'search'
		| 'tempRow'
	> & {
		resolvedColumns: ResolvedColumn<Row>[];
		selectedRows: SvelteSet<Row>;
	};

	// $props
	let {
		isCreatable = true,
		isDeletable = true,
		isPageLengthEditable = true,
		isSearchable = true,
		onCreate,
		onDelete,
		pageLength = $bindable(10),
		resolvedColumns = [],
		rows = $bindable([]),
		search = $bindable(''),
		selectedRows = $bindable(new SvelteSet<Row>()),
		tempRow = $bindable({})
	}: ToolbarProps = $props();

	// $state
	let isCreateOpen = $state(false);
	let isDeleteOpen = $state(false);
	let isSearchOpen = $state(false);
	let isSettingsOpen = $state(false);
	let tempPageLength = $state('10');

	// $derives
	const createFields = $derived(
		resolvedColumns.filter((resolvedColumns) => resolvedColumns.isCreatable)
	);

	// $effects
	$effect(() => {
		untrack(() => {
			tempRow = resolvedColumns.reduce((tempRow: Row, resolvedColumn) => {
				if (resolvedColumn.type === 'boolean') tempRow[resolvedColumn.key] = false;
				else if (resolvedColumn.type === 'date') tempRow[resolvedColumn.key] = new Date();
				else if (resolvedColumn.type === 'number') tempRow[resolvedColumn.key] = 0;
				else if (resolvedColumn.type === 'password') tempRow[resolvedColumn.key] = '';
				else if (resolvedColumn.type === 'select') tempRow[resolvedColumn.key] = '';
				else if (resolvedColumn.type === 'string') tempRow[resolvedColumn.key] = '';
				else if (resolvedColumn.type === 'unknown') tempRow[resolvedColumn.key] = '';

				return tempRow;
			}, {});
		});
	});
</script>

<Div class="relative flex flex-row justify-end gap-1 rounded-none px-6 py-1">
	<Div
		{@attach clickOutside(() => {
			isSettingsOpen = false;
		})}
		class="lg:relative"
		isVisible={isPageLengthEditable}
	>
		<Button
			class="h-10"
			onclick={() => {
				isSettingsOpen = !isSettingsOpen;
				tempPageLength = pageLength.toString();
			}}
			variants={['icon']}
		>
			<Settings />
		</Button>
		<Card
			class="absolute top-full right-0 z-10 w-full gap-4 rounded-none lg:w-auto lg:rounded-md"
			isVisible={isSettingsOpen}
			transition={[dropdown, { duration: 100 }]}
		>
			<Form
				class="flex flex-col gap-4"
				onsubmit={() => {
					pageLength = parseInt(tempPageLength);
					isSettingsOpen = false;
				}}
			>
				<Field label="Page Length">
					<Input bind:value={tempPageLength} min={1} type="number" />
				</Field>
				<Div class="grid grid-cols-2 gap-4">
					<Button
						onclick={() => {
							isSettingsOpen = false;
						}}
						type="button"
						variants={['ghost']}
					>
						Cancel
					</Button>
					<Button type="submit">Update</Button>
				</Div>
			</Form>
		</Card>
	</Div>
	<Div
		{@attach clickOutside(() => {
			isDeleteOpen = false;
		})}
		class="lg:relative"
		isVisible={isDeletable}
	>
		<Button
			class="h-10"
			disabled={selectedRows.size === 0 ? true : undefined}
			onclick={() => {
				isDeleteOpen = !isDeleteOpen;
			}}
			variants={['icon', 'error']}
		>
			<Trash />
		</Button>
		<Form
			class="absolute top-full right-0 z-10 w-full lg:w-auto"
			onsubmit={async () => {
				if (onDelete) await onDelete(selectedRows);
				rows = rows.filter((row) => !selectedRows.has(row));
				selectedRows.clear();
				isDeleteOpen = false;
			}}
		>
			<Card
				class="items-center gap-4 rounded-none bg-red-500 text-white inset-ring-red-400 lg:items-start lg:rounded-md dark:bg-red-500 dark:inset-ring-red-400"
				isVisible={isDeleteOpen}
				transition={[dropdown, { duration: 100 }]}
			>
				<TriangleAlert class="mx-auto h-20 w-20" />
				<Span class="w-full min-w-xs">
					Are you sure you want to delete {selectedRows.size} rows? This cannot be undone.
				</Span>
				<Div class="grid w-full grid-cols-2 gap-4">
					<Button
						class="text-white hover:text-white focus:text-white focus:outline-white/30"
						onclick={() => {
							isDeleteOpen = false;
						}}
						type="button"
						variants={['ghost']}
					>
						Cancel
					</Button>
					<Button
						class="bg-white text-red-500 hover:bg-red-100 hover:text-red-500 focus:bg-red-100 focus:text-red-500 focus:outline-white/30"
						type="submit"
					>
						Delete
					</Button>
				</Div>
			</Card>
		</Form>
	</Div>
	<Div
		{@attach clickOutside(() => {
			isSearchOpen = false;
		})}
		class="lg:relative"
		isVisible={isSearchable}
	>
		<Button
			class="h-10"
			onclick={() => {
				isSearchOpen = !isSearchOpen;
			}}
			variants={['icon']}
		>
			<Search />
		</Button>
		<Card
			class="absolute top-full right-0 z-10 w-full rounded-none lg:w-auto lg:items-start lg:rounded-md"
			isVisible={isSearchOpen}
			transition={[dropdown, { duration: 100 }]}
		>
			<Input bind:value={search} placeholder="Search..." />
		</Card>
	</Div>
	<Div
		{@attach clickOutside(() => {
			isCreateOpen = false;
		})}
		class="lg:relative"
		isVisible={isCreatable}
	>
		<Button
			class="h-10"
			onclick={() => {
				isCreateOpen = !isCreateOpen;
			}}
			variants={['icon']}
		>
			<Plus />
		</Button>
		<Form
			class="absolute top-full right-0 z-10 w-full lg:w-auto"
			onsubmit={async () => {
				const createdRow = onCreate ? await onCreate(tempRow) : tempRow;
				rows.push({ ...createdRow });
			}}
		>
			<Card
				class="gap-2 rounded-none lg:items-start lg:rounded-md"
				isVisible={isCreateOpen}
				transition={[dropdown, { duration: 100 }]}
			>
				{#each createFields as createField}
					<Field label={createField.label}>
						{@render createField.fieldSnippet({ column: createField, key: createField.key })}
					</Field>
				{/each}
				<Div class="grid grid-cols-2 gap-4">
					<Button
						onclick={() => {
							isCreateOpen = false;
						}}
						type="button"
						variants={['ghost']}
					>
						Cancel
					</Button>
					<Button type="submit">Create</Button>
				</Div>
			</Card>
		</Form>
	</Div>
</Div>
