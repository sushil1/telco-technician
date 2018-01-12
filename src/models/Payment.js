import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const paymentSchema = new Schema(
	{
		name: {
			type: String,
			lowercase: true,
			required: true,
			trim: true,
			index: true,
			unique: true
		},
		description: {
			type: String,
			required: true,
			trim: true,
		}
	},{ timestamps: true }
);


paymentSchema.methods.summary = function summary() {
	return {
		_id: this._id,
		name: this.name,
		description:this.description
	};
};


paymentSchema.plugin(uniqueValidator, {
	message: 'this payment system is already made'
});

export default mongoose.model('Payment', paymentSchema);
