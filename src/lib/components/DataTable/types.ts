import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { TransitionProps } from '$lib/components/types';
import { type Theme } from '$lib/theme';
import type { SvelteSet } from 'svelte/reactivity';

export type CellSnippet<T extends Row> = {
	column: ResolvedColumn<T>;
	key: keyof T & string;
	row: T;
};
export type Column<T extends Row> = {
	cellSnippet?: Snippet<[CellSnippet<T>]>;
	fieldSnippet?: Snippet<[FieldSnippet<T>]>;
	key: keyof T & string;
	label?: string;
	isCreatable?: boolean;
	isEditable?: boolean;
	isFilterable?: boolean;
	isSearchable?: boolean;
	isSortable?: boolean;
	isVisible?: boolean;
	options?: { label: string; value: any }[];
	type?: ColumnType;
};
export type ColumnSnippetMapValue<T extends Row> = {
	cellSnippet: Snippet<[CellSnippet<T>]>;
	fieldSnippet: Snippet<[FieldSnippet<T>]>;
};
export type ColumnType =
	| 'boolean'
	| 'date'
	| 'datetime-local'
	| 'number'
	| 'password'
	| 'select'
	| 'string'
	| 'unknown';
export type FieldSnippet<T extends Row> = {
	column: ResolvedColumn<T>;
	key: keyof T & string;
};
export type Props<T extends Row> = HTMLAttributes<HTMLDivElement> & {
	children?: Snippet;
	class?: string;
	columns?: Column<T>[];
	columnTypeSnippetMap?: Map<ColumnType, ColumnSnippetMapValue<T>>;
	element?: HTMLDivElement | null;
	isCreatable?: boolean;
	isDeletable?: boolean;
	isEditable?: boolean;
	isFilterable?: boolean;
	isPageLengthEditable?: boolean;
	isPaginatable?: boolean;
	isSearchable?: boolean;
	isSortable?: boolean;
	isToolbarVisible?: boolean;
	isVisible?: boolean;
	onCreate?: (row: T) => T | Promise<T>;
	onDelete?: (rows: SvelteSet<T>) => void | Promise<void>;
	page?: number;
	pageLength?: number;
	rows?: T[];
	search?: string;
	selectedRows?: SvelteSet<T>;
	sort?: Sort;
	tbody?: Snippet;
	tempRow?: Row;
	theme?: Theme;
	transition?: TransitionProps;
	variants?: string[];
};
export type ResolvedColumn<T extends Row> = Required<Column<T>>;
export type Row = Record<string, unknown>;
export type Sort = {
	direction: 'asc' | 'desc';
	key: string;
} | null;
