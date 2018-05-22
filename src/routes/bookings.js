import { Router } from 'express';
import Booking from '../models/Booking';
import parseErrors from '../utils/parseErrors';
import Service from '../models/Service';
import adminOnly from '../middlewares/adminOnly';
import sendSmsToAdmin from '../utils/sendSMS';
import moment from 'moment';

const router = new Router();

router.post('/', (req, res) => {
  const { data } = req.body;
  const newBooking = new Booking(data);
  newBooking
    .save()
    .then(booking => {
      console.log(booking);
      const date = moment(booking.date).format('MMMM Do YYYY, h:mm:ss a');
      const text = `Booking @ TelcoTechnician::
      ${booking.message}. Name: ${booking.name}. Address:${
        booking.address
      }. Mobile: ${booking.mobile}. Service: ${booking.service}. Date:${date}`;
      console.log(text);
      res.status(201).json({ booking });
      sendSmsToAdmin(text);
    })
    .catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

router.get('/', (req, res) => {
  Booking.find({ proceedToTicket: false })
    .populate('service', 'name')
    .then(bookings => {
      res.status(200).json({
        bookings
      });
    })
    .catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

router.get('/:_id', (req, res) => {
  Booking.findById(req.params._id)
    .then(booking => res.status(200).json({ booking }))
    .catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

router.patch('/:_id', (req, res) => {
  const { data } = req.body;
  Booking.findByIdAndUpdate({ _id: req.params._id }, { ...data }, { new: true })
    .populate('service', 'name')
    .then(booking => res.status(200).json({ booking }))
    .catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

router.delete('/:_id', adminOnly, (req, res) => {
  const id = req.params._id;
  Booking.findByIdAndRemove({ _id: req.params._id })
    .then(() => res.status(200).json({ id }))
    .catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

export default router;
