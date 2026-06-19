import { Theme } from 'sveltewind/theme';
export type ThemeObject = Record<string, ThemeComponent>;
export type { Theme };
export type ThemeComponent = {
	base: string;
	variants?: Record<string, string>;
};
