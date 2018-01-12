import { Router } from 'express';
import JobStatus from '../models/JobStatus';
import authenticateStaff from '../middlewares/authenticateStaff';
import authenticate from '../middlewares/authenticate';
import adminOnly from '../middlewares/adminOnly';

const router = new Router();

//get JobStatusOptions for form input
router.get('/jobstatus-options', (req, res) => {
	JobStatus.find()
		.then(items => {
			const options = items.map(item => ({
				key: item._id,
				value: item._id,
				text: item.name
			}));
			res.status(200).json({ options });
		})
		.catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

router.post('/', adminOnly, (req, res) => {
	const newJobStatus = new JobStatus(req.body);
	newJobStatus
		.save()
		.then(jobstatus => {
			res.status(201).json({ jobstatus });
		})
		.catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});


router.patch('/:_id', adminOnly, (req, res) => {
	const { data } = req.body;
	JobStatus.findByIdAndUpdate({ _id: req.params._id }, { ...data }, { new: true })
		.then(jobstatus => res.status(200).json({ jobstatus }))
		.catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

router.delete('/:_id', adminOnly, (req, res) => {
	const id = req.params._id;
	JobStatus.findByIdAndRemove({ _id: req.params._id })
		.then(() => res.status(200).json({ id }))
		.catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

export default router;
