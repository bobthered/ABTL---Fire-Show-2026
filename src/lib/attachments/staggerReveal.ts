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
		rootMargin = '0px 0px -10% 0px',
		selector = DEFAULT_SELECTOR,
		threshold = 0.15
	}: StaggerRevealOptions = {}
) => {
	let staggerIndex = 0;

	const elements = [...node.querySelectorAll<HTMLElement>(selector)];

	const hideElements = () => {
		for (const el of elements) {
			el.style.opacity = '0';
			el.style.transform = `translateY(${distance}px)`;
			el.style.willChange = 'transform, opacity';
		}
	};

	const animateElement = (el: HTMLElement) => {
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
				delay: staggerIndex++ * delay,
				duration,
				easing,
				fill: 'forwards'
			}
		);
	};

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;

				const el = entry.target as HTMLElement;

				animateElement(el);

				if (once) observer.unobserve(el);
			}
		},
		{
			threshold,
			rootMargin
		}
	);

	const observe = () => {
		for (const el of elements) observer.observe(el);
	};

	const destroy = () => {
		observer.disconnect();
	};

	hideElements();
	observe();

	return destroy;
};
