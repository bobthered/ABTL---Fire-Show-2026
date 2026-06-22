import type { Snippet } from 'svelte';
import type {
	CellSnippet,
	ColumnSnippetMapValue,
	ColumnType,
	FieldSnippet,
	ResolvedColumn,
	Row,
	Sort
} from './types';

export const getPageCount = (rows: Row[], pageLength: number): number => {
	if (pageLength <= 0) return 1;
	return Math.max(1, Math.ceil(rows.length / pageLength));
};
export const inferColumns = <T extends Row>(
	rows: T[] = [],
	columnTypeSnippetMap: Map<ColumnType, ColumnSnippetMapValue<Row>>,
	{
		isCreatable,
		isEditable,
		isFilterable,
		isSearchable,
		isSortable
	}: {
		isCreatable: boolean;
		isEditable: boolean;
		isFilterable: boolean;
		isSearchable: boolean;
		isSortable: boolean;
	}
): ResolvedColumn<T>[] => {
	const keys = [...new Set(rows.flatMap((row) => Object.keys(row)))] as (keyof T & string)[];
	return keys.map((key) => {
		const values = rows
			.map((row) => row[key])
			.filter((value) => value !== null && value !== undefined);

		const label = keyToLabel(key);
		const type = inferColumnType(values);

		return {
			cellSnippet: columnTypeSnippetMap.get(type)?.cellSnippet as Snippet<[CellSnippet<T>]>,
			fieldSnippet: columnTypeSnippetMap.get(type)?.fieldSnippet as Snippet<[FieldSnippet<T>]>,
			isCreatable,
			isEditable,
			isFilterable,
			isSearchable,
			isSortable,
			isVisible: true,
			key,
			label,
			options: [],
			type
		};
	});
};
export const inferColumnType = (values: unknown[]): ColumnType => {
	if (!values.length) {
		return 'unknown';
	}

	if (values.every((value) => typeof value === 'boolean')) {
		return 'boolean';
	}

	if (values.every((value) => typeof value === 'number')) {
		return 'number';
	}

	if (values.every((value) => value instanceof Date)) {
		return 'date';
	}

	if (
		values.every((value) => typeof value === 'string') &&
		values.every((value) => !Number.isNaN(Date.parse(value as string)))
	) {
		return 'date';
	}

	if (values.every((value) => typeof value === 'string')) {
		return 'string';
	}

	return 'unknown';
};
export const keyToLabel = (key: string) =>
	key
		.replace(/([A-Z])/g, ' $1')
		.replace(/[_-]/g, ' ')
		.replace(/\b\w/g, (char) => char.toUpperCase())
		.trim();
export const paginateRows = <T extends Row>(rows: T[], page: number, pageLength: number): T[] => {
	const start = page * pageLength;
	const end = start + pageLength;

	return rows.slice(start, end);
};
export const searchRows = <T extends Row>(
	rows: T[],
	columns: ResolvedColumn<T>[],
	search: string
): T[] => {
	const normalizedSearch = search.trim().toLowerCase();

	if (!normalizedSearch) {
		return rows;
	}

	return rows.filter((row) => {
		return columns.some((column) => {
			if (!column.isSearchable) {
				return false;
			}

			const value = row[column.key];

			if (value === null || value === undefined) {
				return false;
			}

			return String(value).toLowerCase().includes(normalizedSearch);
		});
	});
};
export const sortRows = <T extends Row>(rows: T[], sort: Sort): T[] => {
	if (!sort) {
		return rows;
	}

	const { direction, key } = sort;

	return [...rows].sort((a, b) => {
		const aValue = a[key];
		const bValue = b[key];

		if (aValue == null) return 1;
		if (bValue == null) return -1;

		if (typeof aValue === 'number' && typeof bValue === 'number') {
			return direction === 'asc' ? aValue - bValue : bValue - aValue;
		}

		if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
			return direction === 'asc'
				? Number(aValue) - Number(bValue)
				: Number(bValue) - Number(aValue);
		}

		const aString = String(aValue).toLowerCase();
		const bString = String(bValue).toLowerCase();

		return direction === 'asc' ? aString.localeCompare(bString) : bString.localeCompare(aString);
	});
};
export const updateSort = (key: string, sort: Sort, resolvedColumns: ResolvedColumn<Row>[]) => {
	if (sort === null) return (sort = { direction: 'asc', key: resolvedColumns[0].key });
	if (sort.key === key)
		return (sort = { direction: sort.direction === 'asc' ? 'desc' : 'asc', key });
	return (sort = { direction: 'asc', key });
};
