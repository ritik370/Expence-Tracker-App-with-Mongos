const express = require("express");
const authenticate = require("../middleware/auth");
const controller = require("../controllers/PremiumUser");
const router = express.Router();

router.get("/showLeaderBoard", authenticate, controller.getUserLeaderBoard);

module.exports = router;