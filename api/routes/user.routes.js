// import express from "express";
// import {
//   getUser,
//   updateUser,
//   deleteUser,
//   getUserProfile,
//   getUserListing,
// } from "../controllers/user.control.js";
// import { verifyToken } from "../utils/verifyUser.js";

// const router = express.Router();

// router.get("/profile/:id", verifyToken, getUserProfile);
// router.post("/update/:id", verifyToken, updateUser);
// router.delete("/delete/:id", verifyToken, deleteUser);
// router.get("/listings/:id", verifyToken, getUserListing); // Fixed route path
// router.get("/:id",verifyToken, getUser); // Added to get user by id

// export default router;
import express from "express";
import {
  getUser,
  updateUser,
  deleteUser,
  getUserProfile,
  getUserListing,
} from "../controllers/user.control.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/profile/:id", verifyToken, getUserProfile);
router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/listings/:id", verifyToken, getUserListing);
router.get("/:id", getUser); // Remove verifyToken to make it public

export default router;