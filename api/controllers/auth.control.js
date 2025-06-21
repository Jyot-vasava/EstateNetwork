import user from '../models/user.model.js';
import bcryptjs from 'bcryptjs';  
import {errorHandler} from '../utils/error.js';


export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    const hashpassword = await bcryptjs.hash(password, 10);
    const newUser = new user({ username, email, password: hashpassword });
    try {
      await newUser.save();
  
      res.status(201).json("User created successfully");
    } catch (err) {
      next(err);
    }
  };
  

   
   
