import mongoose, { Schema } from 'mongoose';

const quoteSchema = new Schema(
	{
		name: { type: String, trim: true },
		address: { type: String, trim: true },
		contact: { type: String, trim: true },
		message: { type: String, trim: true }
	},
	{ timestamps: true }
);

export default mongoose.model('Quote', quoteSchema);
