import mongoose from 'mongoose';

export const Registration = mongoose.model(
	'Registration',
	new mongoose.Schema(
		{
			name: { type: String, required: true },
			email: { type: String, required: true, unique: true }
		},
		{ timestamps: true }
	)
);
