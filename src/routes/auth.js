import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { sendResetPasswordEmail, sendCorrectUserEmail } from '../mailer';

const router = new Router();

router.post('/', (req, res) => {
	const { credentials } = req.body;

	User.findOne({ email: credentials.email }).then(user => {
		if (user && user.isValidPassword(credentials.password)) {
			res.status(200).json({ user: user.toAuthJSON() });
		} else if (!user) {
			res.status(400).json({
				errors: { global: 'Email not registered, please sign up' }
			});
		} else {
			res.status(400).json({
				errors: { global: 'Wrong password, Try Again' }
			});
		}
	});
});

router.post('/confirmation', (req, res) => {
	const { token } = req.body;

	User.findOneAndUpdate(
		{ confirmationToken: token },
		{ confirmationToken: '', confirmed: true },
		{ new: true }
	).then(
		user =>
			user
				? res.status(200).json({ user: user.toAuthJSON() })
				: res.status(400).json({ errors: { global: 'Invalid Token' } })
	);
});

router.post('/reset_password_request', (req, res) => {
	const { email } = req.body;

	User.findOne({ email }).then(user => {
		if (user) {
			sendResetPasswordEmail(user);
			res.status(200).json({});
		} else {
			res
				.status(400)
				.json({ errors: { global: "There's no user with such email." } });
		}
	});
});

router.post('/validate_token', (req, res) => {
	const { token } = req.body;
	jwt.verify(token, process.env.JWT_SECRET, err => {
		if (err) {
			res.status(401).json({});
		} else {
			res.status(200).json({});
		}
	});
});

router.post('/reset_password', (req, res) => {
	const { password, token } = req.body.data;
	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			res.status(401).json({ errors: { global: 'Invalid token' } });
		} else {
			User.findOne({ _id: decoded._id }).then(user => {
				if (user) {
					user.setPassword(password);
					user.confirmationToken = '';
					user.confirmed = true;
					user.save().then(() => {
						sendCorrectUserEmail(user);
						res.json({});
					});
				} else {
					res.status(404).json({ errors: { global: 'Invalid Token' } });
				}
			});
		}
	});
});

export default router;
