const User = require("../models/User");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/async");

// @desc    Recommend friends to user
// @route   GET /api/v1/recommendation/
// @access  Private

exports.recommendFriends = asyncHandler(async (req, res, next) => {
  const userId = req.user._id; // Current logged-in user

  // Fetch the current user's data, including their friends
  const user = await User.findById(userId).populate("friends", "_id friends");

  if (!user) {
    return next(new ApiError(404, "User not found"));
  }

  const visited = new Set(); // To keep track of visited users (avoid recommending current friends)
  const recommendations = new Set(); // Store the recommended users
  const queue = []; // Queue for BFS

  // Mark current user as visited and add direct friends to queue
  visited.add(userId);
  user.friends.forEach((friend) => {
    visited.add(friend._id.toString()); // Mark direct friends as visited
    queue.push(friend._id); // Add direct friends to the queue
  });

  // BFS to find friends of friends
  while (queue.length > 0) {
    const currentFriendId = queue.shift(); // Dequeue a friend

    // Fetch this friend's friends
    const currentFriend = await User.findById(currentFriendId).populate(
      "friends",
      "_id"
    );

    // Process their friends (friends of friends)
    currentFriend.friends.forEach((friendOfFriend) => {
      const friendOfFriendId = friendOfFriend._id.toString();

      // If this person is not the user or one of their direct friends, add to recommendations
      if (!visited.has(friendOfFriendId)) {
        recommendations.add(friendOfFriendId);
        visited.add(friendOfFriendId); // Mark them as visited
      }
    });
  }

  // Fetch the details of recommended friends to display
  const recommendedFriends = await User.find({
    _id: { $in: Array.from(recommendations) },
  }).select("firstName lastName email");

  res
    .status(200)
    .json(new ApiResponse(true, 200, "Suggested friends", recommendedFriends));
});
