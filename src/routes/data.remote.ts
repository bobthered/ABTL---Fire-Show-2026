import * as v from 'valibot';
import { form } from '$app/server';
import { connect } from '$lib/mongoose';
import { Registration } from '$lib/mongoose/models';
import { redirect } from '@sveltejs/kit';

export const register = form(
	v.object({
		email: v.pipe(v.string(), v.nonEmpty()),
		name: v.pipe(v.string(), v.nonEmpty())
	}),
	async ({ email, name }) => {
		await connect();

		await Registration.create({ email, name });

		redirect(303, `/success`);
	}
);
