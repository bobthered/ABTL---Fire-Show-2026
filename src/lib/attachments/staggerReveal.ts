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
		rootMargin = '0px',
		selector = DEFAULT_SELECTOR
	}: StaggerRevealOptions = {}
) => {
	const elements = new Set<HTMLElement>();
	const revealed = new Set<HTMLElement>();

	let raf = 0;

	// -------------------------
	// STYLE INITIAL STATE
	// -------------------------
	const hideElement = (el: HTMLElement) => {
		el.style.opacity = '0';
		el.style.transform = `translateY(${distance}px)`;
		el.style.willChange = 'transform, opacity';
	};

	// -------------------------
	// ANIMATION
	// -------------------------
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
				delay: i * delay,
				duration,
				easing,
				fill: 'forwards'
			}
		);
	};

	// -------------------------
	// VISIBILITY CHECK
	// -------------------------
	const isVisible = (el: HTMLElement) => {
		const rect = el.getBoundingClientRect();
		return rect.bottom > 0 && rect.top < window.innerHeight;
	};

	// -------------------------
	// CORE BATCH LOGIC
	// -------------------------
	const run = () => {
		raf = 0;

		const visible: HTMLElement[] = [];

		for (const el of elements) {
			if (once && revealed.has(el)) continue;
			if (isVisible(el)) visible.push(el);
		}

		if (visible.length === 0) return;

		// top → bottom ordering
		visible.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);

		// fresh stagger per viewport batch
		visible.forEach((el, i) => {
			animateElement(el, i);
			revealed.add(el);
		});
	};

	const schedule = () => {
		if (raf) return;
		raf = requestAnimationFrame(run);
	};

	// -------------------------
	// MUTATION OBSERVER (SvelteKit navigation support)
	// -------------------------
	const mutationObserver = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			for (const node of mutation.addedNodes) {
				if (!(node instanceof HTMLElement)) continue;

				register(node);
			}
		}

		schedule();
	});

	// -------------------------
	// REGISTER ELEMENTS
	// -------------------------
	const register = (root: ParentNode) => {
		const found = root.querySelectorAll<HTMLElement>(selector);

		for (const el of found) {
			if (elements.has(el)) continue;

			elements.add(el);
			hideElement(el);
		}
	};

	// -------------------------
	// EVENTS (scroll-driven batching trigger)
	// -------------------------
	const onScroll = () => schedule();
	const onResize = () => schedule();

	// -------------------------
	// INIT
	// -------------------------
	register(node);

	mutationObserver.observe(node, {
		childList: true,
		subtree: true
	});

	window.addEventListener('scroll', onScroll, { passive: true });
	window.addEventListener('resize', onResize);

	// initial run (after paint)
	schedule();

	// -------------------------
	// CLEANUP
	// -------------------------
	return () => {
		mutationObserver.disconnect();
		window.removeEventListener('scroll', onScroll);
		window.removeEventListener('resize', onResize);

		if (raf) cancelAnimationFrame(raf);
	};
};
