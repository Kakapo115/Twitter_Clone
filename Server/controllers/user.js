import { handleError } from "../error.js";
import User from "../models/User.js";
import Tweet from "../models/Tweet.js";

// Getting user by id
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// Updating user
export const updateUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );

      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  } else {
    return next(handleError(403, "You can only update your own account"));
  }
};

// Deleteing user
export const deleteUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      await Tweet.deleteMany({ userId: req.params.id });

      res.status(200).json("User delete");
    } catch (err) {
      next(err);
    }
  } else {
    return next(handleError(403, "You can only update your own account"));
  }
};

// Following user 
export const followUser = async (req, res, next) => {
  try {
    // Get User to follow
    const user = await User.findById(req.params.id);
    // Get Current User
    const currentUser = await User.findById(req.body.id);

    if (!user.followers.includes(req.body.id)) {
      await user.updateOne({ $push: { followers: req.body.id } });
      await currentUser.updateOne({ $push: { following: req.params.id } });
      res.status(200).json("You are now following this user");
    } else {
      res.status(403).json("You are already following this user");
    }
  } catch (err) {
    next(err);
  }
};

// Unfollowing user 
export const unfollowUser = async (req, res, next) => {
  try {
    // Get User to follow
    const user = await User.findById(req.params.id);
    // Get Current User
    const currentUser = await User.findById(req.body.id);

    if (currentUser.following.includes(req.params.id)) {
      await user.updateOne({
        $pull: { followers: req.body.id },
      });
      await currentUser.updateOne({
        $pull: { following: req.params.id },
      });
      res.status(200).json("You are unfollowing this user");
    } else {
      res.status(403).json("You are not following this user");
    }
  } catch (err) {
    next(err);
  }
};
