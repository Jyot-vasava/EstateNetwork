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
        const { username, email, password, image } = req.body;

        // Check if username or email already exists (excluding current user)
        if (username) {
            const existingUser = await User.findOne({
                username,
                _id: { $ne: req.params.id },
            });
            if (existingUser) {
                return next(errorHandler(400, "Username already exists"));
            }
        }

        if (email) {
            const existingUser = await User.findOne({
                email,
                _id: { $ne: req.params.id },
            });
            if (existingUser) {
                return next(errorHandler(400, "Email already exists"));
            }
        }

        const updateData = {};

        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (image) updateData.image = image;

        // Hash password if provided
        if (password) {
            updateData.password = bcryptjs.hashSync(password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        ).select("-password"); // Exclude password from response

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
        });
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