import { browser } from '$app/environment';

type Item = {
	description: string;
	options: Record<string, any>;
	quantity: number;
	type: string;
	unitPrice: number;
	uom: string;
};

const createSession = () => {
	const state: { cart: Item[]; email: string } = $state({
		cart: [],
		email: ''
	});

	if (browser) {
		const saved = localStorage.getItem('cart');

		if (saved) {
			try {
				state.cart = JSON.parse(saved);
			} catch {
				localStorage.removeItem('cart');
			}
		}

		$effect.root(() => {
			$effect(() => {
				localStorage.setItem('cart', JSON.stringify(state.cart));
			});
		});
	}

	return {
		get cart() {
			return state.cart;
		},
		get email() {
			return state.email;
		},
		add(item: Item) {
			state.cart.push(item);
		},
		remove(index: number) {
			state.cart = state.cart.filter((_, i) => i !== index);
		},
		reset() {
			state.cart = [];
			state.email = '';
		}
	};
};

const session = createSession();

export { session };
