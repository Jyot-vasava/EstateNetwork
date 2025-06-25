import express from "express";
import {
    getUser,
    updateUser,
    deleteUser,
    getUserProfile,
} from "../controllers/user.control.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/", getUser);
router.get("/profile/:id", verifyToken, getUserProfile);
router.put("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);

export default router;