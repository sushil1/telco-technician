import { Router } from 'express';
import Payment from '../models/Payment';
import authenticateStaff from '../middlewares/authenticateStaff';
import authenticate from '../middlewares/authenticate';
import adminOnly from '../middlewares/adminOnly';

const router = new Router();

//get PaymentOptions for form input
router.get('/payment-options', authenticate, authenticateStaff, (req, res) => {
	Payment.find()
		.then(payments => {
			const options = payments.map(payment => ({
				key: payment._id,
				value: payment._id,
				text: payment.name
			}));
			res.status(200).json({ options });
		})
		.catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

router.post('/', adminOnly, (req, res) => {
	const newPayment = new Payment(req.body.payment);
	newPayment
		.save()
		.then(payment => {
			res.status(201).json({ payment });
		})
		.catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});


router.patch('/:_id', adminOnly, (req, res) => {
	const { data } = req.body;
	Payment.findByIdAndUpdate({ _id: req.params._id }, { ...data }, { new: true })
		.then(payment => res.status(200).json({ payment }))
		.catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

router.delete('/:_id', adminOnly, (req, res) => {
	const id = req.params._id;
	Payment.findByIdAndRemove({ _id: req.params._id })
		.then(() => res.status(200).json({ id }))
		.catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

export default router;
