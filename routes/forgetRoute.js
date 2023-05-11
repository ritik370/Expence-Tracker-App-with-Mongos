const express = require("express");
const controller = require("../controllers/ForgetCon");
const { Model } = require("sequelize");
const router = express.Router();
router.post("/forgotpassword", controller.forgetPassword);

router.get('/resetpassword/:id',controller.resetPassword);

router.get('/updatepassword/:id',controller.updatepassword);


module.exports=router;