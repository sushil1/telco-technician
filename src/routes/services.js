import { Router } from 'express';
import Service from '../models/Service';
import parseErrors from '../utils/parseErrors';
import authenticate from '../middlewares/authenticate';
import adminOnly from '../middlewares/adminOnly';

const router = new Router();

router.post('/', adminOnly, (req, res) => {
	const serviceData = req.body;
	console.log(req.body);
	const newService = new Service(serviceData);
	newService
		.save()
		.then(service => {
			res.status(201).json({ service });
		})
		.catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

router.get('/', (req, res) => {
	Service.find({})
		.then(services => {
			res.status(200).json({ services });
		})
		.catch(err => res.status(400).json({ errors: err.response.errors }));
});

router.get('/:id', (req, res) => {
	Service.findById(req.params.id)
		.then(service => {
			res.status(200).json({ service });
		})
		.catch(err => res.status(400).json({ errors: err.response.errors }));
});

export default router;
