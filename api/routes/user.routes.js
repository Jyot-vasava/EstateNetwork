import e from 'express';
import express from 'express';
import { getUser } from '../controllers/user.control.js';

const router = express.Router();

router.get('/',getUser);

export default router;