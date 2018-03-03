import mongoose, { Schema } from 'mongoose';
import generateId from '../utils/generateId';
import moment from 'moment';

const bookingSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    mobile: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    service: { type: Schema.Types.ObjectId, ref: 'Service' },
    message: { type: String, trim: true },
    proceedToTicket: { type: Boolean, default: false },
    refrenceId: { type: String }
  },
  { timestamps: true }
);

const generateRefId = () => `B${generateId()}`;

bookingSchema.pre('save', function(next, done) {
  this.refrenceId = generateRefId();
  mongoose.models.Booking.findOne({ refrenceId: this.refrenceId })
    .then(booking => {
      if (!booking) {
        next();
      }
      if (booking) {
        this.refrenceId = generateRefId();
      }
    })
    .catch(err => done(err));
});

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
    refrenceId: this.refrenceId,
    proceedToTicket: this.proceedToTicket,
    createdAt: moment(this.createdAt).fromNow()
  };
};

export default mongoose.model('Booking', bookingSchema);
