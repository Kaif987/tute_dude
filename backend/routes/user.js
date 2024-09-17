const router = require("express").Router();
const { login, register, logout, me } = require("../controllers/user");
const { validate } = require("../middleware/validate.middleware");
const { loginSchema, signupSchema } = require("../validator/user.validator");
const { protect } = require("../middleware/protect");

router.post("/login", validate(loginSchema), login);
router.post("/register", validate(signupSchema), register);
router.post("/logout", logout);
router.get("/me", protect, me)

module.exports = router;
