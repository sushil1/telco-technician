import mongoose, { Schema } from 'mongoose';

const quoteSchema = new Schema(
	{
		name: { type: String, trim: true },
		address: { type: String, trim: true },
		mobile: { type: String, trim: true },
		message: { type: String, trim: true },
		proceedToTicket: { type: Boolean, default: false }
	},
	{ timestamps: true }
);

quoteSchema.methods.toJSON = function toJSON() {
	return {
		_id: this._id,
		name: this.name,
		address: this.address,
		mobile: this.mobile,
		message: this.message,
		proceedToTicket: this.proceedToTicket,
		createdAt: this.createdAt
	};
};

export default mongoose.model('Quote', quoteSchema);
