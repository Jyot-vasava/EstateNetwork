
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
import { v2 as cloudinary } from 'cloudinary';
import cookieParser from 'cookie-parser';




dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));


app.listen(3000, () => {
  console.log('API server is running on http://localhost:3000');
});

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);



//built-in error handler middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
});


app.post("/api/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: "User registered" });
  } catch (err) {
    res.status(500).json({ error: "Failed to register user" });
  }
});




//clodinaty setup

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});


(async function () {

  const result = await cloudinary.api.resources({
    type: 'upload',
    prefix: 'uploads/',
    max_results: 10,
    resource_type: 'image'
  });

})();












