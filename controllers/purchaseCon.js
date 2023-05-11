
const Razorpay = require("razorpay");
const purchaseOrder = require("../models/purchaseModel");
// const token = require("./userCon");
const UserPremium=require('../models/Usermodel')

const jwt = require("jsonwebtoken");


exports.purchasePremium = async (req, res, next) => {
    console.log("......premiummembership........")
    try {
      let rzp = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret:process.env.RAZORPAY_KEY_SECRET,
      });
        const amount = 50000;
        rzp.orders.create({ amount, currency: "INR" }, (err, order) => {

          console.log(order);
          if (err) {
            throw new Error(JSON.stringify(err));
         
          }
            const userId=req.id;
            const orderid=order.id;
            const status="PENDING";
            // console.log(orderId);

            
           
           
              
              purchaseOrder.create({userId,orderid,status}).then((orders)=>{

                // console.log("successfull",orders)
                res.status(200).json({ orders, key_id: rzp.key_id })

              }).catch((err)=>{
                console.log("error>>", err);
                res.status(500).json({ message: "Something went wrong", error: err });


                
              })

         
        });
      } catch (error) {
        console.log("error:", error);
         res.status(500).json({ message: "Something went wrong", error: err });
      }
    };



    // ----------------------------------------------------------------------------------------------

const generateAccessToken = (id, name, ispremiumuser) => {
  return jwt.sign(
    { userId: id, name: name, ispremiumuser },"TOKEN_SECRET"
  );
};

// ----------------------------------------------------------------------------------------------



    exports.updateStatus = async (req, res, next) => {
      try {
        const userId = req.id;
        const name = req.name;
        // console.log(userId + name+">>>>>>");
        // console.log(req.body);
        // res.status(200).json({status:"success"});
        const {  order_id,key } = req.body;
        const order = await purchaseOrder.findOne({ where: { orderid: order_id } });
        const promise1 = order.update({status: "SUCCESSFUL"});
        const premiumUser=await UserPremium.findOne({where:{id:req.id} });
        const promise2 = premiumUser.update({ ispremiumuser: true });
    
        Promise.all([promise1, promise2])
          .then(() => {

             return  res.status(201).json({
              success: true,
              message: "Transaction Successful",
              token: generateAccessToken(userId, name,true),
            });
          })
          .catch((error) => {
            console.log(error);
            throw new Error(error);
          });
      } catch (error) {
        console.log("error:", error);
      }
    };
    

