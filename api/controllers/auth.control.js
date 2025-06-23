import user from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import User from "../models/user.model.js";




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

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await user.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    const isPasswordValid = await bcryptjs.compare(password, validUser.password);
    if (!isPasswordValid) {
      return next(errorHandler(401, "Invalid credentials"));
    }

    const token = jwt.sign(
      { id: validUser._id, email: validUser.email }, process.env.JWT_SECRET);

    const { password: pass, ...rest } = validUser._doc;

    res.cookie("access_token", token, { httpOnly: true }).status(200).json({ rest });

  } catch (err) {
    next(err);
  }
};

export const google = async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user._doc;
      return res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }

    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);
    const hashpassword = await bcryptjs.hash(generatedPassword, 10);

    const newUser = new User({
      username:
        req.body.name.split(" ").join("").toLowerCase() +
        Math.random().toString(36).slice(-5),
      email: req.body.email,
      password: hashpassword,
      image: req.body.image,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    const { password, ...rest } = newUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};








