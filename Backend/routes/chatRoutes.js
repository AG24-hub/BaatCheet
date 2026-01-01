const express = require("express")
const { protect } = require("../middlewares/authMiddleware")
const { accessChat, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup } = require("../controller/chatController")

const router = express.Router()

router.route("/").post(protect, accessChat).get(protect, fetchChats)
router.route("/group").post(protect, createGroupChat)

//for updating we have used put request 
router.route("/rename").put(protect, renameGroup) 
router.route("/groupRemove").put(protect, removeFromGroup)
router.route("/groupAdd").put(protect, addToGroup)

module.exports = router