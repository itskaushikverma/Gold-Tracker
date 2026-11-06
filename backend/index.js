import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import router from './routes/index.js';

const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  }),
);

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT;

connectDB();

app.use('/api', router);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
