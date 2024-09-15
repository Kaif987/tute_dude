const asyncHandler = require("../utils/async");

// @desc    Search for a Friend
// @route   GET /api/v1/friend/search/:id
// @access  Private

exports.getFriend = asyncHandler(async (req, res, next) => {});

// @desc    Delete a friend request
// @route   Delete /api/v1/todo/:id
// @access  Private

exports.deleteFriendRequest = asyncHandler(async (req, res, next) => {});

// @desc    Send a friend request
// @route   GET /api/v1/friend/send/:id
// @access  Private

exports.sendFriendRequest = asyncHandler(async (req, res, next) => {});
