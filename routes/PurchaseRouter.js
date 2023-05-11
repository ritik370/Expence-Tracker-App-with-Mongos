const express = require("express");
const authenticate = require("../middleware/auth");
const conntroller = require("../controllers/purchaseCon");
const Router = express.Router();


Router.get("/premiummembership", authenticate, conntroller.purchasePremium);
Router.post("/updatetransactionstatus", authenticate, conntroller.updateStatus);
module.exports = Router;