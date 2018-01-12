import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const jobStatusSchema = new Schema(
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
	},

	{ timestamps: true }
);


jobStatusSchema.methods.summary = function summary() {
	return {
		_id: this._id,
		name: this.name,
		description:this.description
	};
};


jobStatusSchema.plugin(uniqueValidator, {
	message: 'this job status is already made'
});

export default mongoose.model('JobStatus', jobStatusSchema);
