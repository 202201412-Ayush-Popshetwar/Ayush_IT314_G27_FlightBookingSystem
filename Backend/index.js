import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import AuthRouter from './Routes/AuthRouter.js';
import UserRouter from './Routes/UserRouter.js';
import dotenv from 'dotenv';
import './connection.js';
import SearchRouter from './Routes/SearchRouter.js';
import bookingRouter from './Routes/BookingRouter.js';
import subscribeRouter from './Routes/Subscribe.js';

const app = express();
const PORT = process.env.PORT;
dotenv.config()
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.status(200).send('OK');
});

app.use("/auth",AuthRouter);
app.use("/search", SearchRouter);
app.use(UserRouter);
app.use('/bookings', bookingRouter);
app.use('/api', subscribeRouter);

app.use((req, res) => {
    res.status(404).json({ message: 'Not Found' });
});



export default app;