import { Router } from 'express';
import User from '../models/User';
import parseErrors from '../utils/parseErrors';
import { sendConfirmationEmail } from '../mailer';

const router = new Router();

router.post('/', (req, res) => {
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

export default router;
