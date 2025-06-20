
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); 

const app = express();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.listen(3000, () => {
  console.log('API server is running on http://localhost:3000');
});
