import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const getUser = (req, res) => {
    res.status(200).json({ message: "jack is osm" });
};

export const updateUser = async (req, res, next) => {
    // Check if user is updating their own profile
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, "You can only update your own account"));
    }

    try {
       if(req.body.password){
        req.body.password = bcryptjs.hashSync(req.body.password,10);
       }


       const updatedUser = await User .findByIdAndUpdate(
        req.params.id,
        {
            $set:{
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                profilePicture: req.body.profilePicture,
            },
        },
        { new: true }
       );

       const { password, ...rest } = updatedUser._doc;

       res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, "You can only delete your own account"));
    }

    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Account deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return next(errorHandler(404, "User not found"));
        }
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        next(error);
    }
};