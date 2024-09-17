const router = require("express").Router();
const { protect } = require("../middleware/protect");
const {
  sendFriendRequest,
  searchFriend,
  deleteFriendRequest,
  acceptFriendRequest,
  unfriend,
  getFriends,
} = require("../controllers/friend");

router.get("/send/:id", protect, sendFriendRequest);
router.delete("/delete/:id", protect, deleteFriendRequest);
router.post("/search", protect, searchFriend);
router.get("/accept/:id", protect, acceptFriendRequest);
router.get("/unfriend/:id", protect, unfriend);
router.get("/my-friends", protect, getFriends);

module.exports = router;
