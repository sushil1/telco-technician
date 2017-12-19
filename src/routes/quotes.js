import { Router } from 'express';
import Quote from '../models/Quote';
import parseErrors from '../utils/parseErrors';

const router = new Router();

router.post('/', (req, res) => {
	const { quoteData } = req.body;
	const newQuote = new Quote(quoteData);
	newQuote
		.save()
		.then(quote => {
			res.status(201).json({ quote });
		})
		.catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

export default router;
