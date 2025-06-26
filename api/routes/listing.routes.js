import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createlisting } from '../controllers/listing.control.js';

const  router = express.Router();

 router.post('/create',verifyToken, createlisting);

 export default router;