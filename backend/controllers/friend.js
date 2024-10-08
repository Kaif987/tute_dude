const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/async");
const mongoose = require("mongoose");

// @desc    Search other registered users
// @route   POST /api/v1/friend/search/
// @access  Private

exports.searchFriend = asyncHandler(async (req, res, next) => {
  const { searchQuery } = req.body;
  const userId = req.user._id; // The ID of the logged-in user

  // Use a regular expression to perform a case-insensitive search
  const searchRegex = new RegExp(searchQuery, "i");

  // Search for users whose username or email match the query
  let users = await User.find({
    _id: { $ne: userId, $nin: req.user.friends }, // Exclude the logged-in user and user friends from the search results
    $or: [
      { username: { $regex: searchRegex } },
      { email: { $regex: searchRegex } },
    ],
  })
    .select("_id username hobbies email phoneNumber")
    .lean();

  if (!users.length) {
    return res.status(200).json({
      success: true,
      data: [],
    });
  }

  // also add a property to each user indicating if logged-in user has sent a friend request to them
  // also exclude users who have sent a friend request to the logged-in user

  users = users.map((user) => {
    return {
      ...user,
      friendRequestSent: req.user.outGoingFriendRequest.includes(user._id),
      friendRequestReceived: req.user.incomingFriendRequest.includes(user._id),
    };
  });

  // Return the matching users
  res.status(200).json({
    success: true,
    data: users,
  });
});

// @desc    Delete a friend request
// @route   Delete /api/v1/todo/:id
// @access  Private

exports.deleteFriendRequest = asyncHandler(async (req, res, next) => {
  const friendId = req.params.id;
  const userId = req.user._id;

  const user = await User.findById(userId);
  const friend = await User.findById(friendId);

  if (!user || !friend) {
    return next(new ApiError(404, "User or friend not found"));
  }

  // Check if there is an outgoing friend request
  const hasOutgoingRequest = user.outGoingFriendRequest.includes(friendId);
  const hasIncomingRequest = user.incomingFriendRequest.includes(friendId);

  if (!hasOutgoingRequest && !hasIncomingRequest) {
    return next(new ApiError(400, "No friend request found"));
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  if (hasOutgoingRequest) {
    // Remove the outgoing friend request from the user
    await User.updateOne(
      { _id: userId },
      { $pull: { outGoingFriendRequest: friendId } }
    ).session(session);

    // Remove the incoming friend request from the friend
    await User.updateOne(
      { _id: friendId },
      { $pull: { incomingFriendRequest: userId } }
    ).session(session);
  }

  if (hasIncomingRequest) {
    // Remove the incoming friend request from the user
    await User.updateOne(
      { _id: userId },
      { $pull: { incomingFriendRequest: friendId } }
    ).session(session);

    // Remove the outgoing friend request from the friend
    await User.updateOne(
      { _id: friendId },
      { $pull: { outGoingFriendRequest: userId } }
    ).session(session);
  }

  // Commit the transaction
  await session.commitTransaction();
  session.endSession();

  res
    .status(200)
    .json(new ApiResponse(true, 200, "Friend request deleted", null));
});

// @desc    Send a friend request
// @route   GET /api/v1/friend/send/:id
// @access  Private

exports.sendFriendRequest = asyncHandler(async (req, res, next) => {
  const friendId = req.params.id;
  const userId = req.user._id;

  const user = await User.findById(userId);
  const friend = await User.findById(friendId);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!user) {
      await session.abortTransaction();
      next(new ApiError(400, "User not found"));
    }

    if (!friend) {
      await session.abortTransaction();
      next(new ApiError(400, "Friend not found"));
    }

    await User.updateOne(
      { _id: userId },
      { $push: { outGoingFriendRequest: friendId } }
    ).session(session);

    await User.updateOne(
      { _id: friendId },
      { $push: { incomingFriendRequest: userId } }
    ).session(session);

    // Commit the transaction
    await session.commitTransaction();

    res.json(
      new ApiResponse(true, 200, "Friend Request Sent Successfully", null)
    );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return next(
      new ApiError(
        500,
        "Something went wrong while sending the friend request",
        error
      )
    );
  }
});

exports.acceptFriendRequest = asyncHandler(async (req, res, next) => {
  const friendId = req.params.id; // The ID of the user who sent the friend request
  const userId = req.user._id; // The ID of the logged-in user accepting the request

  const user = await User.findById(userId);
  const friend = await User.findById(friendId).select(
    "_id username hobbies email phoneNumber"
  );

  if (!user) {
    return next(new ApiError(404, "User not found"));
  }

  if (!friend) {
    return next(new ApiError(404, "Friend not found"));
  }

  // Check if there is an incoming friend request from this friend
  const hasIncomingRequest = user.incomingFriendRequest.includes(friendId);

  if (!hasIncomingRequest) {
    return next(new ApiError(400, "No friend request found from this user"));
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Remove the incoming friend request from the user
    await User.updateOne(
      { _id: userId },
      { $pull: { incomingFriendRequest: friendId } }
    ).session(session);

    // Remove the outgoing friend request from the friend
    await User.updateOne(
      { _id: friendId },
      { $pull: { outGoingFriendRequest: userId } }
    ).session(session);

    // Add the friend to the user's friends list
    await User.updateOne(
      { _id: userId },
      { $push: { friends: friendId } }
    ).session(session);

    // Add the user to the friend's friends list
    await User.updateOne(
      { _id: friendId },
      { $push: { friends: userId } }
    ).session(session);

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res
      .status(200)
      .json(new ApiResponse(true, 200, "Friend request accepted", friend));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return next(
      new ApiError(
        500,
        "Something went wrong while accepting the friend request"
      )
    );
  }
});

exports.unfriend = asyncHandler(async (req, res, next) => {
  const friendId = req.params.id; // The ID of the user to be unfriended
  const userId = req.user._id; // The ID of the logged-in user

  const user = await User.findById(userId);
  const friend = await User.findById(friendId);

  if (!user) {
    return next(new ApiError(404, "User not found"));
  }

  if (!friend) {
    return next(new ApiError(404, "Friend not found"));
  }

  const areFriends = user.friends.includes(friendId);

  if (!areFriends) {
    return next(new ApiError(400, "This user is not your friend"));
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Remove the friend from the user's friends list
    await User.updateOne(
      { _id: userId },
      { $pull: { friends: friendId } }
    ).session(session);

    // Remove the user from the friend's friends list
    await User.updateOne(
      { _id: friendId },
      { $pull: { friends: userId } }
    ).session(session);

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "User unfriended successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return next(
      new ApiError(500, "Something went wrong while unfriending the user")
    );
  }
});

exports.getFriends = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const user = await User.findById(userId).populate(
    "friends",
    "_id username hobbies email phoneNumber"
  );

  res
    .status(200)
    .json(new ApiResponse(true, 200, "User Friends found", user.friends));
});

exports.getFriendRequests = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const user = await User.findById(userId).populate(
    "incomingFriendRequest",
    "_id username hobbies email phoneNumber"
  );

  if (!user.incomingFriendRequest.length) {
    return res
      .status(200)
      .json(new ApiResponse(true, 200, "No friend requests found", []));
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        true,
        200,
        "User friend requests found",
        user.incomingFriendRequest
      )
    );
});
