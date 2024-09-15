const router = require("express").Router();
const { protect } = require("../middleware/protect");
const {
  sendFriendRequest,
  getFriend,
  deleteFriendRequest,
} = require("../controllers/friend");

router.get("/send/:id", protect, sendFriendRequest);
router.delete("/delete/:id", protect, deleteFriendRequest);
router.get("/search/:id", protect, getFriend);

module.exports = router;
