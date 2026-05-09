import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './src/config/db.js';
import router from './src/routes/index.js';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ['https://gold-tracker-neon.vercel.app', process.env.FRONTEND_URL],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT;

connectDB();

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.get('/', (req, res) => {
  res.send('MERN Backend running 🚀');
});

app.use('/api', router);

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT || 5000, () => {
    console.log(`Server is running on port ${PORT || 5000}`);
  });
}

export default app;
