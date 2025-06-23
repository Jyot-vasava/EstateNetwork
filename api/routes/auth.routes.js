import express from 'express';
import { signin, signup, google } from '../controllers/auth.control.js';


const router = express.Router();


router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', google);

// router.get('/', (req, res) => {
//     res.send('Auth route is working');
//   });

export default router;