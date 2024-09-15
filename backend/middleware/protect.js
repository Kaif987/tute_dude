const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/async");
const User = require("../models/User");

exports.protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;

  // make sure token exists
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized to access this route" });
  }

  try {
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);
    req.user = await User.findById(decoded.id);
    next();
  } catch (e) {
    // return next(new ErrorResponse("Not authorized to access this route", 401));
    return res
      .status(401)
      .json({ success: false, message: "Not authorized to access this route" });
  }
});
