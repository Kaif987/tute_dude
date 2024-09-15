const User = require("../models/User");
const asyncHandler = require("../utils/async");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public

exports.register = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (user) {
    throw new ApiError(400, "User already exists");
  }

  const newUser = await User.create({ 
    
  });

  console.log("new user created", newUser);
  await newUser.save();
  sendTokenResponse(newUser, 201, res);
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "User with the given email does not exist");
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    throw new ApiError(400, "Invalid credentials");
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Public

exports.logout = (req, res) => {
  res.cookie("token", "");
  res
    .status(200)
    .json(new ApiResponse(true, 200, "User logged out successfully", null));
};

// Get token from model , create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  console.log("sendTokenResponse");
  const token = user.getSignedJwtToken();

  const options = {
    //Cookie will expire in 30 days
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  // Cookie security is false .if you want https then use this code. do not use in development time
  if (process.env.NODE_ENV === "proc") {
    options.secure = true;
  }
  //we have created a cookie with a token

  res
    .status(statusCode)
    .cookie("token", token, options) // key , value ,options
    .json({
      success: true,
      token,
    });
};
