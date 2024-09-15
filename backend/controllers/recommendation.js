const User = require("../models/User");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/async");

// @desc    Recommend friends to user
// @route   GET /api/v1/recommendation/
// @access  Private

exports.recommendation = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const user = await User.findById(userId).populate("friends");

  const friends = user.friends;
  const friendsOfFriends = [];

  for (let friend of friends) {
    const friendOfFriend = await User.findById(friend._id).populate("friends");
    friendsOfFriends.push(friendOfFriend.friends);
  }

  const recommendedFriends = friendsOfFriends.flat().filter((friend) => {
    return (
      !friends.some((f) => f._id.equals(friend._id)) &&
      !friend._id.equals(userId)
    );
  });

  res
    .status(200)
    .json(
      new ApiResponse(true, 200, "Recommended friends", recommendedFriends)
    );
});
