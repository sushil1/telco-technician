import { Router } from 'express';
import User from '../models/User';
import parseErrors from '../utils/parseErrors';
import { sendConfirmationEmail } from '../mailer';
import authenticateStaff from '../middlewares/authenticateStaff';
import adminOnly from '../middlewares/adminOnly';

const router = new Router();

router.post('/', adminOnly, (req, res) => {
	const { email, password } = req.body.user;
	const newUser = new User({ email });
	newUser.setPassword(password);
	newUser.generateConfirmationToken();
	newUser
		.save()
		.then(user => {
			sendConfirmationEmail(user);
			res.status(201).json({ user: user.toAuthJSON() });
		})
		.catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

//TODO: authenticate admin route only

router.get('/', adminOnly, (req, res) => {
	User.find()
		.then(users => {
			const userList = users.map(user => user.summary());

			res.status(200).json({
				users: userList
			});
		})
		.catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

router.get('/:_id', adminOnly, (req, res) => {
	User.findById(req.params._id)
		.then(user => res.status(200).json({ user }))
		.catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

router.patch('/:_id', adminOnly, (req, res) => {
	const { data } = req.body;
	User.findByIdAndUpdate({ _id: req.params._id }, { ...data }, { new: true })
		.then(user => res.status(200).json({ user }))
		.catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

router.delete('/:_id', adminOnly, (req, res) => {
	const id = req.params._id;
	User.findByIdAndRemove({ _id: req.params._id })
		.then(() => res.status(200).json({ id }))
		.catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

//get staffOptions for form input
router.get('/staff', authenticateStaff, (req, res) => {
	User.find({ role: 'technician' })
		.then(users => {
			const options = users.map(user => ({
				key: user._id,
				value: user._id,
				text: `${user.email} -- ${user.role}`
			}));
			res.status(200).json({ options });
		})
		.catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

export default router;
