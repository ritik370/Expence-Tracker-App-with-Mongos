const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require('cors')
const helmet = require("helmet");
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// external builtinModules...............

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



app.use(morgan('combined', { stream: accessLogStream }))

app.use(
  morgan("combined", {
    stream: errorLogStream,
    skip: (req, res) => res.statusCode < 400,
  })
);


// models.............................


const User = require('./models/Usermodel');
const Expense = require("./models/ExpenceModel");
const Order = require("./models/purchaseModel");
const ForgetPassword = require("./models/ForgetPassword");

// Routes........................

const UserRoutes = require('./routes/userRoutes')
const sequelize = require("./util/database");
const ExpenseRouter = require('./routes/ExpenceRouter')
const purchaseRouter = require('./routes/PurchaseRouter')
const PremiumRouter = require('./routes/PremiumRUser');
const forgetRoute = require('./routes/forgetRoute');
const ForgetPasswordRouter = require('./routes/forgetRoute');
const { builtinModules } = require("module");

// Relations...............................
User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgetPassword);
ForgetPassword.belongsTo(User);



app.use("/user", UserRoutes)
app.use("/expense", ExpenseRouter);
app.use('/purchase', purchaseRouter);
app.use("/preminum", PremiumRouter);
app.use('/forget', forgetRoute);
app.use("/password", ForgetPasswordRouter);
//.................................


sequelize.sync().then(() => {
  app.listen(5500);
}).catch((err) => {
  console.log(err);
})
