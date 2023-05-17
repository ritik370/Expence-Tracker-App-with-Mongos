const Sib = require('sib-api-v3-sdk')
const uuid = require("uuid");
// const secure_configuration = require('./secure');
const bcrypt = require("bcrypt");
const User = require("../models/Usermodel");
const ForgetPassword = require("../models/ForgetPassword");
require("dotenv").config();

// -----------------------------------------------------------------------------

exports.forgetPassword = async (req, res, next) => {
    console.log(req.body);
//   try {
    const email = req.body.email;
    const user = await User.findOne({ where: { email: email } });
    console.log(user);
   
    if (user) {
      const UserSignUpId = user.id;
      const id = uuid.v4();
      console.log(id +" "+UserSignUpId)
    
     await ForgetPassword.create({
        id,
        isactive: true,
        UserSignUpId
      }).catch((err) => {
        console.log(err);
        throw new Error(err);
      });
      const client = Sib.ApiClient.instance
      const apiKey = client.authentications['api-key']
      apiKey.apiKey = process.env.SENDINBLUE_API_KEY

      const tranEmailApi = new Sib.TransactionalEmailsApi()
      const sender = {
          email: 'gritik3700@gmail.com',
          name: 'Ritik',
      }
      const receivers = [
          {
              email: req.body.email,
          },
      ]
      tranEmailApi
      .sendTransacEmail({
          sender,
          to: receivers,
          subject: 'Reset Password',
          textContent: `Forget Password`,
          htmlContent: `<a href="http://localhost:5500/password/resetpassword/${id}">Reset password</a>`,
        
      })
      .then((success)=>{
        console.log("your mail successfully sended",+success);
        res.status(200).json({ message: "Link to reset password sent to your mail ",success: true,});
      })
      .catch((error)=>{
        console.log("your mail successfully sended");

        console.log(error)

      })
        
      




    }

};



exports.resetPassword = async (req, res, next) => {
    // console.log("checking ..........")
    try {
      const id = req.params.id;
      const forgotpasswordrequest = await ForgetPassword.findOne({
        where: { id: id },
      });
    //   console.log(forgotpasswordrequest)
      if (forgotpasswordrequest) {
        await forgotpasswordrequest.update({ isactive: false });
  
        res.status(200).send(`<html>
              <script>
                  function formsubmitted(e){
                      e.preventDefault();
                    
                  }
              </script>
              <form action="/password/updatepassword/${id}" method="get">
                  <label for="newpassword">Enter New password</label>
                  <input name="newpassword" type="password" required></input>
                  <button>Reset password</button>
              </form>
          </html>`);
        res.end();
      } else {
        throw new Error("invalid uuid");
      }
    } catch (err) {
      res.status(500).json({ message: err, success: false });
    }
  };



  exports.updatepassword = async (req, res, next) => {
    try {
      const { newpassword } = req.query;
  
      const resetpasswordid = req.params.id;
  
      const resetpasswordrequest = await ForgetPassword.findOne({
        where: { id: resetpasswordid },
      });
      const user = await User.findOne({
        where: { id: resetpasswordrequest.userId },
      });
      
      if (user) {
        const saltRounds = 10;
        bcrypt.hash(newpassword, saltRounds, function (err, hash) {
          if (err) {
            console.log(err);
            return res.status(500).json({ message: err });
          }
          user
            .update({ password: hash })
            .then(() => {
              res
                .status(201)
                .json({ message: "Successfuly updated the new password" });
            })
            .catch((err) => {
              return res.status(500).json({ message: err });
            });
        });
      } else {
        return res.status(404).json({ error: "No user Exists", success: false });
      }
    } catch (error) {
      return res.status(403).json({ error, success: false });
    }
  };
  