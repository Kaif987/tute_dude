const z = require("zod");
const ApiError = require("../utils/ApiError");

exports.validate = (schema) => async (req, res, next) => {
  try {
    console.log("INSIDE VALIDATE MIDDLEWALRE");
    const { success, data, error } = schema.safeParse(req.body);
    console.log("success", success);
    if (!success) {
      throw new z.ZodError(error);
    }
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      next(new ApiError(400, "Validation failed", errors));
    } else {
      next(error);
    }
  }
};
