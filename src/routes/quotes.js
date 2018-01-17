import { Router } from 'express';
import Quote from '../models/Quote';
import parseErrors from '../utils/parseErrors';

const router = new Router();

router.post('/', (req, res) => {
	const { data } = req.body;
	const newQuote = new Quote(data)
	newQuote.setRefrenceId()
		newQuote
		.save()
		.then(quote => res.status(201).json({ quote }))
		.catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});


router.get('/', (req, res) => {
	Quote.find()
		.then(quotes => res.status(200).json({ quotes }))
		.catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

router.get('/:_id', (req, res) => {
	Quote.findById(req.params._id)
		.then(quote => res.status(200).json({ quote }))
		.catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

router.patch('/:_id', (req, res) => {
	const { data } = req.body;
	Quote.findByIdAndUpdate({ _id: req.params._id }, { ...data }, { new: true })
		.then(quote => res.status(200).json({ quote }))
		.catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

router.delete('/:_id', (req, res) => {
	Quote.findByIdAndRemove({ _id: req.params._id })
		.then(() => res.status(200).json({ id: req.params._id }))
		.catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

export default router;
