import mongoose, { Schema } from 'mongoose';
import generateId from '../utils/generateId'

const quoteSchema = new Schema(
	{
		name: { type: String, trim: true },
		address: { type: String, trim: true },
		mobile: { type: String, trim: true },
		message: { type: String, trim: true },
		proceedToTicket: { type: Boolean, default: false },
		refrenceId:{type:String}
	},
	{ timestamps: true }
);

quoteSchema.methods.setRefrenceId = function setRefrenceId(){
	this.refrenceId = `Q${generateId()}`
}


quoteSchema.methods.toJSON = function toJSON() {
	return {
		_id: this._id,
		name: this.name,
		address: this.address,
		mobile: this.mobile,
		message: this.message,
		proceedToTicket: this.proceedToTicket,
		refrenceId:this.refrenceId,
		createdAt: this.createdAt
	};
};

export default mongoose.model('Quote', quoteSchema);
