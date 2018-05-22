import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import logger from 'morgan';
import dotenv from 'dotenv';
import auth from './routes/auth';
import users from './routes/users';
import quotes from './routes/quotes';
import services from './routes/services';
import bookings from './routes/bookings';
import tickets from './routes/tickets';
import payments from './routes/payments';
import jobstatus from './routes/jobstatus';
import upload from './routes/upload';

dotenv.config({
  path: path.join(__dirname, '.env')
});

const app = express();
const PORT = process.env.PORT;

app.use('/static', express.static(path.join(__dirname, 'static')));

//db
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_DB_URL, { useMongoClient: true });

mongoose.connection
  .once('open', () => console.log('MongoDB connected'))
  .on('error', err => console.log(`DB connection failed ${err}`));

//middlewares
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//routes
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/quotes', quotes);
app.use('/api/services', services);
app.use('/api/bookings', bookings);
app.use('/api/tickets', tickets);
app.use('/api/payments', payments);
app.use('/api/jobstatus', jobstatus);
app.use('/api/upload', upload);

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
