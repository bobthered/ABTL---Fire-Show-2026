import * as v from 'valibot';
import { form, query } from '$app/server';
import { connect } from '$lib/mongoose';
import { Registration } from '$lib/mongoose/models';
import { redirect } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';

const listeners: Set<(value: unknown) => void> = new Set();
let registrations: Record<string, any>[] | null = null;

const loadRegistrations = async () => {
	await connect();

	registrations = await Registration.find()
		.lean()
		.then((docs) => docs.map((doc) => ({ ...doc, _id: String(doc._id) })));
};

export const deleteRegistration = form(
	v.object({
		_id: v.pipe(v.string(), v.nonEmpty()),
		index: v.pipe(v.string(), v.nonEmpty())
	}),
	async ({ _id, index }) => {
		await connect();

		if (registrations) registrations = registrations.filter((_, i) => i !== +index);
		await Registration.deleteOne({ _id: new ObjectId(_id) });

		return { success: true };
	}
);
export const getRegistrations = query.live(async function* () {
	if (registrations === null) await loadRegistrations();

	while (true) {
		yield registrations;
		const { promise, resolve } = Promise.withResolvers();
		listeners.add(resolve);
		await promise;
	}
});
export const register = form(
	v.object({
		email: v.pipe(v.string(), v.nonEmpty()),
		name: v.pipe(v.string(), v.nonEmpty())
	}),
	async ({ email, name }) => {
		await connect();

		const document = await Registration.create({ email, name });
		const registration = document.toObject();
		if (registrations) registrations.push({ ...registration, _id: String(registration._id) });
		for (const listener of listeners) listener('');
		listeners.clear();

		redirect(303, `/success`);
	}
);
