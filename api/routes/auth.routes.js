import express from 'express';
import { signup } from '../controllers/auth.control.js';

const router = express.Router();


router.post('/signup',signup);

router.get('/', (req, res) => {
    res.send('Auth route is working');
  });

export default router;