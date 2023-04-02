import express from 'express';
import mongoose from 'mongoose';
import { env } from './env';
import { userRouter } from './routes/user.routes';
const app = express();

import cors from 'cors';
app.use(cors());
connectToDatabase().catch(err => console.log(err));

async function connectToDatabase() {
  await mongoose.connect(env.DATABASE_URL);
  console.log('Connected to Database');
}
app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
app.use('/user', userRouter);
app.listen(env.PORT, () => console.log('Server started on PORT '+env.PORT));