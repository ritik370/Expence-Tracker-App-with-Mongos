const express = require("express");
const bodyParser = require("body-parser");
const app=express();
const cors = require("cors");
const helmet = require("helmet");
const morgan=require('morgan');
const fs=require('fs');
const path=require('path');



// Routes........................

const UserRoutes=require('./routes/userRoutes')
const sequelize = require("./util/database");
const ExpenseRouter=require('./routes/ExpenceRouter')
const purchaseRouter=require('./routes/PurchaseRouter')
const PremiumRouter=require('./routes/PremiumRUser');
const forgetRoute=require('./routes/forgetRoute');
const ForgetPasswordRouter = require('./routes/forgetRoute')


const accessLogStream = fs.createWriteStream(
    path.join(__dirname, "access.log"),
    { flags: "a" }
  );

  const errorLogStream = fs.createWriteStream(path.join(__dirname, "error.log"), {
    flags: "a",
  });

app.use(cors());//call external file source in express app..
app.use(helmet());//for application secure purpose...
app.use(bodyParser.json({ extended: false }));


app.use("/user",UserRoutes)
app.use("/expense", ExpenseRouter);
app.use(morgan('combined',{stream:accessLogStream}))

app.use(
    morgan("combined", {
      stream: errorLogStream,
      skip: (req, res) => res.statusCode < 400,
    })
  );

app.use('/purchase',purchaseRouter);
app.use("/preminum", PremiumRouter);
app.use('/forget',forgetRoute);
app.use("/password", ForgetPasswordRouter);



sequelize.sync().then(()=>{
    app.listen(5500);
}).catch((err)=>{
    console.log(err);
})
