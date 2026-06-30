type StaggerRevealOptions = {
	delay?: number;
	duration?: number;
	distance?: number;
	easing?: string;
	once?: boolean;
	rootMargin?: string;
	selector?: string;
	threshold?: number;
};

const DEFAULT_SELECTOR = `
	h1,h2,h3,h4,h5,h6,
	p,
	span,
	button,
	input,
	textarea,
	select,
	label,
	svg,
	img,
	[data-stagger]
`
	.replace(/\s+/g, '')
	.trim();

export const staggerReveal = (
	node: HTMLElement,
	{
		delay = 30,
		duration = 500,
		distance = 24,
		easing = 'cubic-bezier(.22,1,.36,1)',
		once = true,
		rootMargin = '0px 0px 0px 0px',
		selector = DEFAULT_SELECTOR,
		threshold = 0
	}: StaggerRevealOptions = {}
) => {
	const elements = [...node.querySelectorAll<HTMLElement>(selector)];
	const revealed = new Set<HTMLElement>();

	const hideElements = () => {
		for (const el of elements) {
			el.style.opacity = '0';
			el.style.transform = `translateY(${distance}px)`;
			el.style.willChange = 'transform, opacity';
		}
	};

	const animateElement = (el: HTMLElement, i: number) => {
		el.animate(
			[
				{
					opacity: 0,
					transform: `translateY(${distance}px)`
				},
				{
					opacity: 1,
					transform: 'translateY(0)'
				}
			],
			{
				delay: i * delay, // 👈 LOCAL stagger only
				duration,
				easing,
				fill: 'forwards'
			}
		);
	};

	const observer = new IntersectionObserver(
		(entries) => {
			// 1. collect visible + not yet revealed
			const visible: HTMLElement[] = [];

			for (const entry of entries) {
				if (!entry.isIntersecting) continue;

				const el = entry.target as HTMLElement;

				if (once && revealed.has(el)) continue;

				visible.push(el);
			}

			if (visible.length === 0) return;

			// 2. sort top → bottom (important for natural feel)
			visible.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);

			// 3. reset stagger PER batch
			visible.forEach((el, i) => {
				animateElement(el, i);
				revealed.add(el);
			});
		},
		{
			threshold,
			rootMargin
		}
	);

	const observe = () => {
		for (const el of elements) {
			observer.observe(el);
		}
	};

	const destroy = () => {
		observer.disconnect();
	};

	hideElements();
	observe();

	return destroy;
};
