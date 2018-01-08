import mongoose, { Schema } from 'mongoose';

const bookingSchema = new Schema(
	{
		name: { type: String, required: true, trim: true },
		email: { type: String, required: true, trim: true, lowercase: true },
		mobile: { type: String, required: true, trim: true },
		date: { type: String, required: true, trim: true },
		address: { type: String, required: true, trim: true },
		service: { type: Schema.Types.ObjectId, ref: 'Service' },
		message: { type: String, trim: true },
		proceedToTicket: { type: Boolean, default: false }
	},
	{ timestamps: true }
);

bookingSchema.methods.toJSON = function toJSON() {
	return {
		_id: this._id,
		name: this.name,
		email: this.email,
		mobile: this.mobile,
		date: this.date,
		address: this.address,
		service: this.service,
		message: this.message,
		proceedToTicket: this.proceedToTicket,
		createdAt: this.createdAt
	};
};

export default mongoose.model('Booking', bookingSchema);
