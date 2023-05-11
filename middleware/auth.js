const jwt = require("jsonwebtoken");
const User=require("../models/Usermodel");

const authenticate = (req, res, next) => {
    try {
      
      const token = req.header("Authorization");
      // console.log(token);
      const user = (jwt.verify(token, "TOKEN_SECRET"));
      User.findByPk(user.userId).then((user) => {
        // console.log("user:....", user.name);
        
        req.id = user.id;
        req.name=user.name;
        next();
      });
    } catch (error) {
      console.log("error:", error);
      return res.status(401).json({ success: false });
    }
  };
  
  module.exports = authenticate;