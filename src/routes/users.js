import { Router } from 'express';
import User from '../models/User';
import parseErrors from '../utils/parseErrors';

const router = new Router();

router.post('/', (req, res) => {
	const { email, password } = req.body.user;
	const newUser = new User({ email });
	newUser.setPassword(password);
	newUser
		.save()
		.then(user => {
			res.status(201).json({ user: user.toAuthJSON() });
		})
		.catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

export default router;
