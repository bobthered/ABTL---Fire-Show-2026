export const dropdown = (_: Element, { delay = 0, duration = 50 }) => {
	return {
		delay,
		duration,
		css: (t: number) => `
				opacity: ${t};
				scale: ${t * 0.05 + 0.95};
				top: calc(100% - ${(1 - t) * 0.25}rem);
				transform-origin: top center;
			`
	};
};
