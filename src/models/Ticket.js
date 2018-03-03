import mongoose, { Schema } from 'mongoose';
//import generateId from '../utils/generateId'

const ticketSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    mobile: { type: String, required: true, trim: true },
    date: { type: Date, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    service: { type: Schema.Types.ObjectId, ref: 'Service' },
    bookingId: { type: String, trim: true },
    quoteId: { type: String, trim: true },
    assignedStaff: { type: Schema.Types.ObjectId, ref: 'User' },
    jobStatus: { type: Schema.Types.ObjectId, ref: 'JobStatus' },
    paymentStatus: { type: Schema.Types.ObjectId, ref: 'Payment' },
    refrenceId: { type: String },
    message: { type: String, trim: true },
    notes: { type: String, trim: true },
    cost: { type: String, trim: true },
    acceptedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

ticketSchema.statics = {
  getTicketsForTechnician(technicianId) {
    return this.find({ assignedStaff: technicianId });
  },

  createTicket(args, user) {
    return this.create({
      ...args,
      createdBy: user
    });
  }
};

// const generateRefId = () => `T${generateId()}`
//
// ticketSchema.pre('save', function(next, done){
// 	if(!this.refrenceId){
// 		this.refrenceId = generateRefId()
// 		mongoose.models.Ticket.findOne({refrenceId: this.refrenceId})
// 			.then((ticket)=>{
// 				if(!ticket){next()}
// 				if(ticket){
// 					this.refrenceId = generateRefId()
// 				}
// 			})
// 			.catch(err => done(err))
// 	}
//
// 	next()
// })

ticketSchema.methods.toJSON = function toJSON() {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    mobile: this.mobile,
    date: this.date,
    address: this.address,
    service: this.service,
    message: this.message,
    createdAt: this.createdAt,
    bookingId: this.bookingId,
    quoteId: this.quoteId,
    assignedStaff: this.assignedStaff,
    jobStatus: this.jobStatus,
    refrenceId: this.refrenceId || null,
    paymentStatus: this.paymentStatus,
    notes: this.notes,
    cost: this.cost,
    createdBy: this.createdBy,
    acceptedBy: this.acceptedBy
  };
};

export default mongoose.model('Ticket', ticketSchema);
