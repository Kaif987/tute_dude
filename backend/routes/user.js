const router = require("express").Router();
const { login, register, logout } = require("../controllers/user");
const { validate } = require("../middleware/validate.middleware");
const { loginSchema, signupSchema } = require("../validator/user.validator");

router.post("/login", validate(loginSchema), login);
router.post("/register", validate(signupSchema), register);
router.post("/logout", logout);

module.exports = router;
