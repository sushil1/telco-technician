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
					if (user) {
						req.currentUser = {
							_id: user._id,
							email: user.email,
							role: user.role,
							confirmed: user.confirmed
						};
						next();
					} else {
						res.status(401).json({ errors: { global: 'User not found' } });
					}
				});
			}
		});
	} else {
		res.status(400).json({ errors: { global: 'You are not authorized' } });
	}
};
