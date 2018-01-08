import mongoose, { Schema } from 'mongoose';

const serviceSchema = new Schema(
	{
		name: { type: String, required: true, trim: true, unique: true },
		description: { type: String, required: true, trim: true },
		thumbnail: { type: String },
		time: { type: String, required: true },
		cost: { type: String, required: true }
	},
	{ timestamps: true }
);

serviceSchema.methods.toJSON = function toJSON() {
	return {
		_id: this._id,
		name: this.name,
		description: this.description,
		thumbnail: this.thumbnail,
		time: this.time,
		cost: this.cost
	};
};

export default mongoose.model('Service', serviceSchema);
