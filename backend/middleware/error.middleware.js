const ApiError = require("../utils/ApiError");
const z = require("zod");

exports.errorHandler = (error, req, res, next) => {
  const errorMessage =
    error.message.trim() === "" ? "Something went wrong" : error.message;

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: error.success,
      statusCode: error.statusCode || 500,
      message: errorMessage,
      errors: error.errors,
    });
  }

  if (error instanceof z.ZodError) {
    const errors = error.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));

    return res.status(400).json({
      message: "Validation failed",
      errors: errors,
      success: false,
    });
  }
};

