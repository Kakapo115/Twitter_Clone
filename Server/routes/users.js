import Express from "express";
import { getUser, updateUser, deleteUser, followUser, unfollowUser } from "../controllers/user.js";
import { verifyToken } from "../verifyToken.js";

const router = new Express.Router();

// Get user
router.get("/find/:id", getUser);

// Update user
router.put("/:id", verifyToken, updateUser);

// Delete user
router.delete("/:id", verifyToken, deleteUser);

// Follow user
router.put("/follow/:id", verifyToken, followUser);

// Unfollow user
router.put("/unfollow/:id", verifyToken, unfollowUser);

export default router;
