const router = require("express").Router();
const { protect } = require("../middleware/protect.js");
const { recommendFriends } = require("../controllers/recommendation");

router.get("/", protect, recommendFriends);

module.exports = router;
