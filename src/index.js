import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import auth from './routes/auth';
import users from './routes/users';
import quotes from './routes/quotes';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

//db
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_DB_URL, { useMongoClient: true });

mongoose.connection
	.once('open', () => console.log('MongoDB connected'))
	.on('error', err => console.log(`DB connection failed ${err}`));

//middlewares

app.use(bodyParser.json());

//routes
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/quotes', quotes);

app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}`);
});
