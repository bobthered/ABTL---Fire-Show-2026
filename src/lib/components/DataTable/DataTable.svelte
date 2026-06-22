<script lang="ts">
	import {
		ChevronDown,
		ChevronFirst,
		ChevronLast,
		ChevronLeft,
		ChevronRight
	} from '@lucide/svelte';
	import { untrack, type Snippet } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { twMerge } from 'tailwind-merge';
	import {
		noopTransition,
		Div,
		Button,
		Span,
		Card,
		Table,
		Thead,
		Tr,
		Th,
		Tbody,
		Td,
		Select,
		Checkbox,
		Input
	} from '$lib/components';
	import { theme as globalTheme } from '$lib/theme';
	import {
		getPageCount,
		inferColumns,
		paginateRows,
		searchRows,
		sortRows,
		updateSort
	} from './helpers';
	import Toolbar from './Toolbar.svelte';
	import type { CellSnippet, Column, FieldSnippet, Props, ResolvedColumn, Row } from './types';

	// $props
	let {
		children,
		class: className = '',
		columns = [],
		columnTypeSnippetMap = new Map([
			['boolean', { cellSnippet: booleanCellSnippet, fieldSnippet: booleanFieldSnippet }],
			['date', { cellSnippet: dateCellSnippet, fieldSnippet: dateFieldSnippet }],
			[
				'datetime-local',
				{ cellSnippet: datetimeLocalCellSnippet, fieldSnippet: datetimeLocalFieldSnippet }
			],
			['number', { cellSnippet: numberCellSnippet, fieldSnippet: numberFieldSnippet }],
			['password', { cellSnippet: passwordCellSnippet, fieldSnippet: passwordFieldSnippet }],
			['select', { cellSnippet: selectCellSnippet, fieldSnippet: selectFieldSnippet }],
			['string', { cellSnippet: stringCellSnippet, fieldSnippet: stringFieldSnippet }],
			['unknown', { cellSnippet: stringCellSnippet, fieldSnippet: stringFieldSnippet }]
		]),
		element = $bindable(null),
		isCreatable = true,
		isDeletable = true,
		isEditable = true,
		isFilterable = false,
		isPageLengthEditable = true,
		isPaginatable = true,
		isSearchable = true,
		isSortable = true,
		isToolbarVisible = true,
		isVisible = $bindable(true),
		onCreate,
		onDelete,
		page = $bindable(0),
		pageLength = $bindable(10),
		rows = $bindable([]),
		search = $bindable(''),
		selectedRows = $bindable(new SvelteSet<Row>()),
		sort = $bindable(null),
		tbody,
		tempRow = $bindable({}),
		theme = globalTheme,
		transition = [noopTransition, {}],
		variants = [],
		...restProps
	}: Props<Row> = $props();

	// helpers
	const mergeColumns = <T extends Row>(
		columns: Column<T>[] = [],
		inferredColumns: ResolvedColumn<T>[] = []
	): ResolvedColumn<T>[] => {
		const inferredColumnMap = new Map(inferredColumns.map((column) => [column.key, column]));

		const keys = [
			...new Set([
				...inferredColumns.map((column) => column.key),
				...columns.map((column) => column.key)
			])
		];

		return keys.map((key) => {
			const inferredColumn = inferredColumnMap.get(key);
			const column = columns.find((column) => column.key === key);
			const type = column?.type ?? inferredColumn?.type ?? 'unknown';

			const cellSnippet =
				column?.cellSnippet ??
				(column?.type
					? (columnTypeSnippetMap.get(type)?.cellSnippet as Snippet<[CellSnippet<T>]>)
					: (inferredColumn?.cellSnippet ??
						(columnTypeSnippetMap.get(type)?.cellSnippet as Snippet<[CellSnippet<T>]>)));
			const fieldSnippet =
				column?.fieldSnippet ??
				(column?.type
					? (columnTypeSnippetMap.get(type)?.fieldSnippet as Snippet<[FieldSnippet<T>]>)
					: (inferredColumn?.fieldSnippet ??
						(columnTypeSnippetMap.get(type)?.fieldSnippet as Snippet<[FieldSnippet<T>]>)));

			return {
				cellSnippet,
				fieldSnippet,
				isCreatable: column?.isCreatable ?? inferredColumn?.isCreatable ?? isCreatable,
				isEditable: column?.isEditable ?? inferredColumn?.isEditable ?? isEditable,
				isFilterable: column?.isFilterable ?? inferredColumn?.isFilterable ?? isFilterable,
				isSearchable: column?.isSearchable ?? inferredColumn?.isSearchable ?? isSearchable,
				isSortable: column?.isSortable ?? inferredColumn?.isSortable ?? isSortable,
				isVisible: column?.isVisible ?? inferredColumn?.isVisible ?? true,
				key,
				label: column?.label ?? inferredColumn?.label ?? key,
				options: column?.options ?? inferredColumn?.options ?? [],
				type
			};
		});
	};

	// $state
	let isRowsSelected = $state(false);

	// $derived
	const classes = $derived(theme.resolve('dataTable', variants, className));
	const inferredColumns = $derived(
		inferColumns(rows, columnTypeSnippetMap, {
			isCreatable,
			isEditable,
			isFilterable,
			isSearchable,
			isSortable
		})
	);
	const resolvedColumns = $derived(
		mergeColumns(columns, inferredColumns).filter((resolvedColumn) => resolvedColumn.isVisible)
	);
	const searchedRows = $derived(searchRows(rows, resolvedColumns, search));
	const sortedRows = $derived(sortRows(searchedRows, sort));
	const pageCount = $derived(getPageCount(sortedRows, pageLength));
	const paginatedRows = $derived(
		isPaginatable ? paginateRows(sortedRows, page, pageLength) : sortedRows
	);
	const pageOptions = $derived(
		Array.from({ length: pageCount }, (_, index) => {
			const start = Math.min(index * pageLength + 1, sortedRows.length);
			const end = Math.min((index + 1) * pageLength, sortedRows.length);

			return {
				label: `${start} - ${end}`,
				value: String(index)
			};
		})
	);

	// $effects
	$effect(() => {
		if (sort === null) {
			untrack(() => {
				sort = {
					direction: 'asc',
					key: resolvedColumns[0].key
				};
			});
		}
	});
	$effect(() => {
		if (page > pageCount - 1) {
			page = pageCount - 1;
		}
	});
	$effect(() => {
		search;

		untrack(() => {
			page = 0;
		});
	});
	$effect(() => {
		if (selectedRows.size === paginatedRows.length) isRowsSelected = true;
		if (selectedRows.size === 0) isRowsSelected = false;
	});
	$effect(() => {
		untrack(() => {
			tempRow = resolvedColumns.reduce((tempRow: Row, resolvedColumn) => {
				const key = resolvedColumn.key;

				if (resolvedColumn.type === 'boolean') tempRow[key] = false;
				else if (resolvedColumn.type === 'date') tempRow[key] = new Date();
				else if (resolvedColumn.type === 'number') tempRow[key] = 0;
				else if (resolvedColumn.type === 'password') tempRow[key] = '';
				else if (resolvedColumn.type === 'select') tempRow[key] = '';
				else if (resolvedColumn.type === 'string') tempRow[key] = '';
				else if (resolvedColumn.type === 'unknown') tempRow[key] = '';

				return tempRow;
			}, {});
		});
	});
</script>

<Div {...restProps} bind:element bind:isVisible class={classes} {transition}>
	{#if children}
		{@render children()}
	{:else}
		<Card class="rounded-none p-0">
			{#if isToolbarVisible && (isSearchable || isFilterable || isDeletable || isPageLengthEditable)}
				<Toolbar
					bind:pageLength
					bind:rows
					bind:search
					bind:selectedRows
					bind:tempRow
					{isCreatable}
					{isDeletable}
					{isPageLengthEditable}
					{isSearchable}
					{onCreate}
					{onDelete}
					{resolvedColumns}
				/>
			{/if}
			<Div class="relative overflow-auto">
				<Table class="w-full">
					<Thead>
						<Tr>
							{#if isToolbarVisible && isDeletable}
								<Th class="sticky top-0">
									<Checkbox
										checked={isRowsSelected}
										onchange={(e) => {
											if (e.currentTarget.checked)
												paginatedRows.forEach((row) => selectedRows.add(row));
											if (!e.currentTarget.checked) selectedRows.clear();
										}}
									/>
								</Th>
							{/if}
							{#each resolvedColumns as resolvedColumn}
								<Th class={twMerge('sticky top-0', resolvedColumn.isSortable ? 'p-0' : undefined)}>
									{#if resolvedColumn.isSortable}
										<Button
											class="flex w-full items-center justify-between rounded-none"
											onclick={() => {
												sort = updateSort(resolvedColumn.key, sort, resolvedColumns);
											}}
											variants={['ghost']}
										>
											<Span class="whitespace-nowrap">{resolvedColumn.label}</Span>
											<Div isVisible={sort?.key === resolvedColumn.key}>
												<ChevronDown
													class={twMerge(
														'transition duration-200',
														sort?.direction === 'asc' ? 'rotate-0' : 'rotate-180'
													)}
												/>
											</Div>
										</Button>
									{:else}
										{resolvedColumn.label}
									{/if}
								</Th>
							{/each}
						</Tr>
					</Thead>
					<Tbody>
						{#if tbody}
							{@render tbody()}
						{:else}
							{#each paginatedRows as row}
								<Tr>
									{#if isToolbarVisible && isDeletable}
										<Td>
											<Checkbox
												checked={selectedRows.has(row)}
												onchange={(e) => {
													if (e.currentTarget.checked) selectedRows.add(row);
													if (!e.currentTarget.checked) selectedRows.delete(row);
												}}
											/>
										</Td>
									{/if}
									{#each resolvedColumns as resolvedColumn}
										{@render resolvedColumn.cellSnippet({
											column: resolvedColumn,
											key: resolvedColumn.key,
											row
										})}
									{/each}
								</Tr>
							{/each}
						{/if}
					</Tbody>
				</Table>
			</Div>
			{#if isPaginatable}
				<Card
					class="flex flex-row items-center justify-center gap-1 rounded-none bg-gray-100 px-3 py-1 inset-ring-gray-300 dark:bg-gray-800 dark:inset-ring-gray-700"
				>
					<Button
						class="h-10"
						disabled={page <= 0}
						onclick={() => {
							page = 0;
						}}
						variants={['icon']}
					>
						<ChevronFirst />
					</Button>

					<Button
						class="h-10"
						disabled={page <= 0}
						onclick={() => {
							page = Math.max(0, page - 1);
						}}
						variants={['icon']}
					>
						<ChevronLeft />
					</Button>

					<Select
						onchange={(event) => {
							page = Number(event.currentTarget.value);
						}}
						options={pageOptions}
						value={String(page)}
					/>

					<Button
						class="h-10"
						disabled={page >= pageCount - 1}
						onclick={() => {
							page = Math.min(pageCount - 1, page + 1);
						}}
						variants={['icon']}
					>
						<ChevronRight />
					</Button>

					<Button
						class="h-10"
						disabled={page >= pageCount - 1}
						onclick={() => {
							page = pageCount - 1;
						}}
						variants={['icon']}
					>
						<ChevronLast />
					</Button>
				</Card>
			{/if}
		</Card>
	{/if}
</Div>

{#snippet booleanCellSnippet<T extends Row>({ column, key, row }: CellSnippet<T>)}
	<Td>
		<Checkbox
			bind:checked={
				() => Boolean(row[key]),
				(value: boolean) => {
					(row as Row)[key] = value;
				}
			}
			disabled={column.isEditable ? undefined : true}
		/>
	</Td>
{/snippet}
{#snippet dateCellSnippet<T extends Row>({ column, key, row }: CellSnippet<T>)}
	<Td class="p-0">
		<Input
			bind:value={
				() => {
					const value = row[key];
					const date = value instanceof Date ? value.toLocaleDateString('en-CA') : '1970-01-01';
					return date;
				},
				(value: string) => {
					(row as Row)[key] = new Date(value);
				}
			}
			class="w-full"
			readonly={column.isEditable ? undefined : true}
			variants={['ghost', 'square']}
			type="date"
		/>
	</Td>
{/snippet}
{#snippet datetimeLocalCellSnippet<T extends Row>({ column, key, row }: CellSnippet<T>)}
	<Td class="p-0">
		<Input
			bind:value={
				() => {
					const value = row[key];
					let date: Date;
					if (typeof value === 'string') date = new Date(value);
					else if (value instanceof Date) date = value;
					else {
						throw new Error('Wrong value type');
					}
					const offset = date.getTimezoneOffset();
					const localDate = new Date(date.getTime() - offset * 60000);

					return localDate.toISOString().slice(0, 16);
				},
				(value: string) => {
					(row as Row)[key] = new Date(value);
				}
			}
			class="w-full"
			readonly={column.isEditable ? undefined : true}
			variants={['ghost', 'square']}
			type="datetime-local"
		/>
	</Td>
{/snippet}
{#snippet numberCellSnippet<T extends Row>({ column, key, row }: CellSnippet<T>)}
	<Td class="p-0">
		<Input
			bind:value={
				() => {
					const value = row[key];

					if (typeof value === 'number') return String(value);
					if (typeof value === 'string') return value;

					return '';
				},
				(value: string) => {
					(row as Row)[key] = parseFloat(value);
				}
			}
			class="w-full text-right"
			readonly={column.isEditable ? undefined : true}
			variants={['ghost', 'square']}
			type="number"
		/>
	</Td>
{/snippet}
{#snippet passwordCellSnippet<T extends Row>({ column, key, row }: CellSnippet<T>)}
	<Td class="p-0">
		<Input
			bind:value={
				() => {
					const value = row[key];

					if (typeof value === 'number') return String(value);
					if (typeof value === 'string') return value;

					return '';
				},
				(value: string) => {
					(row as Row)[key] = value;
				}
			}
			class="w-full"
			readonly={column.isEditable ? undefined : true}
			variants={['ghost', 'square']}
			type="password"
		/>
	</Td>
{/snippet}
{#snippet selectCellSnippet<T extends Row>({ column, key, row }: CellSnippet<T>)}
	<Td class="p-0">
		<Select
			bind:value={row[key]}
			disabled={column.isEditable ? undefined : true}
			options={column.options}
			variants={['input.variant.ghost', 'input.variant.square']}
		/>
	</Td>
{/snippet}
{#snippet stringCellSnippet<T extends Row>({ column, key, row }: CellSnippet<T>)}
	<Td class="p-0">
		<Input
			bind:value={
				() => {
					const value = row[key];

					if (typeof value === 'number') return String(value);
					if (typeof value === 'string') return value;

					return '';
				},
				(value: string) => {
					(row as Row)[key] = value;
				}
			}
			class="w-full"
			readonly={column.isEditable ? undefined : true}
			variants={['ghost', 'square']}
		/>
	</Td>
{/snippet}

{#snippet booleanFieldSnippet<T extends Row>({ key }: FieldSnippet<T>)}
	<Checkbox
		bind:checked={
			() => Boolean(tempRow[key]),
			(value: boolean) => {
				tempRow[key] = value;
			}
		}
	/>
{/snippet}
{#snippet dateFieldSnippet<T extends Row>({ key }: FieldSnippet<T>)}
	<Input
		bind:value={
			() => {
				const value = tempRow[key];
				const date = value instanceof Date ? value.toLocaleDateString('en-CA') : '1970-01-01';
				return date;
			},
			(value: string) => {
				tempRow[key] = new Date(value);
			}
		}
		type="date"
	/>
{/snippet}
{#snippet datetimeLocalFieldSnippet<T extends Row>({ key }: FieldSnippet<T>)}
	<Input
		bind:value={
			() => {
				const value = tempRow[key];
				let date: Date;
				if (typeof value === 'string') date = new Date(value);
				else if (value instanceof Date) date = value;
				else {
					throw new Error('Wrong value type');
				}
				const offset = date.getTimezoneOffset();
				const localDate = new Date(date.getTime() - offset * 60000);

				return localDate.toISOString().slice(0, 16);
			},
			(value: string) => {
				tempRow[key] = new Date(value);
			}
		}
		type="datetime-local"
	/>
{/snippet}
{#snippet numberFieldSnippet<T extends Row>({ key }: FieldSnippet<T>)}
	<Input
		bind:value={
			() => {
				const value = tempRow[key];

				if (typeof value === 'number') return String(value);
				if (typeof value === 'string') return value;

				return '';
			},
			(value: string) => {
				(tempRow as Row)[key] = parseFloat(value);
			}
		}
		class="text-right"
		type="number"
	/>
{/snippet}
{#snippet passwordFieldSnippet<T extends Row>({ key }: FieldSnippet<T>)}
	<Input
		bind:value={
			() => {
				const value = tempRow[key];

				if (typeof value === 'number') return String(value);
				if (typeof value === 'string') return value;

				return '';
			},
			(value: string) => {
				(tempRow as Row)[key] = value;
			}
		}
		type="password"
	/>
{/snippet}
{#snippet selectFieldSnippet<T extends Row>({ column, key }: FieldSnippet<T>)}
	<Select bind:value={tempRow[key]} options={column.options} />
{/snippet}
{#snippet stringFieldSnippet<T extends Row>({ key }: FieldSnippet<T>)}
	<Input
		bind:value={
			() => {
				const value = tempRow[key];

				if (typeof value === 'number') return String(value);
				if (typeof value === 'string') return value;

				return '';
			},
			(value: string) => {
				(tempRow as Row)[key] = value;
			}
		}
	/>
{/snippet}
