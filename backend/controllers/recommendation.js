const User = require("../models/User");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/async");

// @desc    Recommend friends to user
// @route   GET /api/v1/recommendation/
// @access  Private

exports.recommendFriends = asyncHandler(async (req, res, next) => {
  const userId = req.user._id.toString(); // Current logged-in user

  // Fetch the current user's data, including their friends
  const user = await User.findById(userId).populate("friends", "_id friends");

  if (!user) {
    return next(new ApiError(404, "User not found"));
  }

  const directFriends = new Set(
    user.friends.map((friend) => friend._id.toString())
  );
  const visited = new Set([userId, ...directFriends]); // Mark user and direct friends as visited
  const recommendations = new Set(); // Store the recommended users
  const queue = Array.from(directFriends); // Queue for BFS, start with direct friends

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

      // If this person is not visited and not a direct friend, add to recommendations
      if (
        !visited.has(friendOfFriendId) &&
        !directFriends.has(friendOfFriendId)
      ) {
        recommendations.add(friendOfFriendId);
        visited.add(friendOfFriendId); // Mark them as visited
        queue.push(friendOfFriendId); // Add to queue to explore their friends
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
