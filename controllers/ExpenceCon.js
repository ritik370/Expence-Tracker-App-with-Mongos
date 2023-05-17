const Expense = require("../models/ExpenceModel");
const User=require('../models/Usermodel');
const sequelize = require("../util/database");


require("dotenv").config();
// const Aws = require("aws-sdk");

exports.addExpense = async (req, res, next) => {
    let amount = req.body.amount;
    let description = req.body.description;
    let category = req.body.category;

    let userId=req.id;
  
    try {
      const data = await Expense.create({
        amount,
        description,
        category,
        UserSignUpId:req.id
      }).then((expense) => {
        const totalvalue= User.findOne({ where:{id:req.id}}).then((res)=>{
       const totalExpenses = Number(res.dataValues.totalExpenses) + Number(amount);

       User.update({ totalExpenses: totalExpenses },{ where: { id: req.id } });
        })
  
      });
      res.status(200).json({ expense: data, success: true });
    } catch (error) {
      console.log("error:", error);
      res.status(500).json({ success: false, error: error });
    }
  };

//   /................................

  exports.getExpense = async (req, res, next) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
  
    try {
      // let table = await Expense.findAll({ where: { UserSignUpId: req.id } });
      const NewData  = await Expense.findAll({ where: { UserSignUpId: req.id } ,
        offset: (page - 1) * limit,
        limit: limit,
      });
  // console.log("dekho yr shief demop hai issliye koi tention mt lena")
    // console.log(table);
       res.status(200).json({
        NewData,
        currentPage: page,
        nextPage: page + 1,
        previouspage: page - 1,
        lastpage: Math.ceil(NewData.length / limit),
      });
    } catch (error) {
      console.log("error:", error);
      res.status(500).json({ success: false, error: error });
    }
  };
  
  // --------------------------------------
  
  exports.deleteExpense = async (req, res, next) => {
    const t = await sequelize.transaction();
    // console.log(t)
    console.log("this is delete buttoon")
    try {
      // console.log("check...............................")
      const id = req.params.id;
      const Deleteuser=await Expense.findOne({ where: { id: id } })

      const response = await Expense.destroy({
        where: { id: id },
        transaction: t,
  
      });
    
if(response===0){
 
  return res.status(401).json({
    message: "Expense does not Belongs to User",
    success: false,
  });
  // t.rollback()
}else{
  await User.findOne({ where:{id:req.id}}).then((res)=>{
    const totalExpenses = Number(res.dataValues.totalExpenses) - Number(Deleteuser.amount);
    User.update({ totalExpenses: totalExpenses },{ where: { id: req.id } });

  })
  await t.commit();
  
}
return res.status(200).json({ message: response, success: true })
      

    } catch (error) {
      t.rollback();
      console.log("error:", error);
    }
  };

  //............................................


  exports.downloadExpense = async (req, res, next) => {
    try {
      const ex = await Expense.findAll({ where: { userId: req.id } });
      const good = JSON.stringify(ex);
      const userId = req.id;
      const fileName = `Expense${userId}/${new Date()}.txt`;
      const fileUrl = await uploadToS3(good, fileName);
      console.log(fileName, fileUrl);
      let data = await DownloadedFiles.create({
        url: fileUrl,
        userId: req.user.id,
      });
  
      res.status(200).json({ data: data, success: true });
    } catch (error) {
      console.log("error:", error);
      res.status(500).json({ success: false });
    }
  };
  
  