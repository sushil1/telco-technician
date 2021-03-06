import jwt from 'jsonwebtoken';
import User from '../models/User';

export default (req, res, next) => {
	const header = req.headers.authorization;

	let token;

	if (header) {
		token = header.split(' ')[1];
	}

	if (token) {
		jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
			if (err) {
				res.status(401).json({ errors: { global: 'invalid token' } });
			} else {
				User.findOne({ email: decoded.email }).then(user => {
					if (user && user.role === 'admin') {
						req.currentUser = {
							_id: user._id,
							name: user.name,
							email: user.email,
							role: user.role,
							confirmed: user.confirmed
						};
						next();
					} else {
						res.status(401).json({ errors: { global: 'User is not admin' } });
					}
				});
			}
		});
	} else {
		res.status(400).json({ errors: { global: 'You are not authorized' } });
	}
};
