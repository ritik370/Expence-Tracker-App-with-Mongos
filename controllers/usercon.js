//
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User=require("../models/Usermodel");
require("dotenv").config();


exports.signup = async (req, res, next) => {
  

    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const salt = 10;
        
        bcrypt.hash(password, salt, async (err, hash) => {
          console.log(err);
          const newUser = await User.create({ name, email, password: hash });
          res.status(200).json({ data: newUser });
        //   console.log(newUser);
        });
      } catch (err) {
        console.log("error show")
        // console.log("err:", err);
      }
}

const secrettoken="TOKEN_SECRET";
const generateAccessToken = (id, name, ispremiumuser) => {
    return jwt.sign({userId: id, name: name, ispremiumuser:ispremiumuser },
      "TOKEN_SECRET"
    );
  };
exports.login = async (req, res, next) => {
    try {
      const name = req.body.name;
      const email = req.body.email;
      const password = req.body.password;
    //   console.log(req.body);
      const Founduser = await User.findAll({
        where: { name, email },
      });
    //   console.log("ritik"+Founduser);
      if (Founduser === null) {
        // console.log("ritik")
        return res.status(404).json({ msg: "User is not founded" });
      } else {
        bcrypt.compare(password, Founduser[0].password, (err, response) => {
          if (err) {
           
            return res.json({ success: false, message: "Something Went Wrong" });
          }
          if (response) {
          
              res.status(200).json({
                success: true,
                message: Founduser,
                token: generateAccessToken(
                   Founduser[0].id,
                   Founduser[0].name,
                   Founduser[0].ispremiumuser
                ),
                
                
              });
          }
        });
      }
    } catch (err) {
      console.log("err:", err);
    }
  };



    


