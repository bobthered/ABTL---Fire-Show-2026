const createSession = () => {
	const state = $state({
		cart: [],
		email: ''
	});

	return {
		reset() {
			state.cart = [];
			state.email = '';
		}
	};
};

const session = createSession();

export { session };
