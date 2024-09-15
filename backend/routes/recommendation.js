const router = require("express").Router();
const { recommendation } = require("../controllers/recommendation");

router.get("/", protect, recommendation);

module.exports = router;
