import { Router } from 'express';
import Ticket from '../models/Ticket';
import parseErrors from '../utils/parseErrors';
//import Service from '../models/Service';


import authenticate from '../middlewares/authenticate';
import adminOnly from '../middlewares/adminOnly';
import authenticateStaff from '../middlewares/authenticateStaff';

const router = new Router();

router.post('/', authenticate, authenticateStaff, (req, res) => {
	const { data } = req.body;
	const { bookingId, quoteId } = data;
	const user = req.currentUser._id;


	// bookingId &&
	// 	Booking.findByIdAndUpdate({ _id: bookingId }, { proceedToTicket: true });
	Ticket.createTicket(data, user)
		.then(ticket => res.status(201).json({ ticket }))
		.catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

router.get('/', authenticate, authenticateStaff, (req, res) => {
	let ticketQuery;
	if (req.currentUser.role === 'admin') {
		ticketQuery = {};
	} else if (req.currentUser.role === 'technician') {
		ticketQuery = { assignedStaff: req.currentUser._id };
	}


	Ticket.find(ticketQuery)
		.populate('service', 'name')
		.populate('assignedStaff', 'name')
		.populate('jobStatus', 'name')
		.populate('paymentStatus', 'name')
		.then(tickets => {
			res.status(200).json({
				tickets
			});
		})
		.catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

router.get('/tracker', (req, res) => {


	Ticket.findOne(req.query)
		.populate('service', 'name')
		.populate('assignedStaff', 'name')
		.populate('jobStatus', 'name')
		.populate('paymentStatus', 'name')
		.then(ticket => {
			if(ticket){
			res.status(200).json({
				ticket
			})
		} else{
			res.status(400).json({ errors: {global: 'Not found'}})
		}
		})
		.catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

router.get('/:_id', authenticate, authenticateStaff, (req, res) => {
	Ticket.findById(req.params._id)
		.populate('service', 'name')
		.populate('assignedStaff', 'name')
		.populate('jobStatus', 'name')
		.populate('paymentStatus', 'name')
		.then(ticket => res.status(200).json({ ticket }))
		.catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

router.patch('/:_id', authenticate, authenticateStaff, (req, res) => {
	const { data } = req.body;


				Ticket.findByIdAndUpdate({ _id: req.params._id }, { ...data }, { new: true })
					.populate('service', 'name')
					.populate('assignedStaff', 'name')
					.populate('jobStatus', 'name')
					.populate('paymentStatus', 'name')


		.then(ticket => res.status(200).json({ ticket }))
		.catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

router.patch('/accept/:_id', authenticate, authenticateStaff, (req, res) => {
	const ticketId = req.params._id
	const userId = req.currentUser._id


	Ticket.findByIdAndUpdate({_id: ticketId}, {$addToSet: {acceptedBy: userId }}, {new:true, upsert:true})
	.populate('service', 'name')
	.populate('assignedStaff', 'name')
	.populate('jobStatus', 'name')
	.populate('paymentStatus', 'name')
	.then(ticket => res.status(200).json({ ticket }))
	.catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
})

router.patch('/decline/:_id', authenticate, authenticateStaff, (req, res) => {
	const ticketId = req.params._id
	const userId = req.currentUser._id

	//have to work on how to remove user's association with the ticket and also notify admin

	Ticket.findByIdAndUpdate({_id: ticketId},{assignedStaff:null}, {new:true})
	.populate('service', 'name')
	.populate('assignedStaff', 'name')
	.populate('jobStatus', 'name')
	.populate('paymentStatus', 'name')
	.then(ticket => res.status(200).json({ ticket }))
	.catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
})

router.delete('/:_id', adminOnly, (req, res) => {
	const id = req.params._id;
	Ticket.findByIdAndRemove({ _id: req.params._id })
		.then(() => res.status(200).json({ id }))
		.catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

export default router;
