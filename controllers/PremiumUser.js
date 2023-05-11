const Expense = require("../models/ExpenceModel");
const User = require("../models/Usermodel");
const sequelize = require("../util/database");

exports.getUserLeaderBoard = async (req, res, next) => {
  try {
    const leaderBoardOfUsers = await User.findAll({
      order: [["totalExpenses", "DESC"]],
    });
    // const leaderboardofusers = await User.find().sort({totalExpenses:-1})
    res.status(200).json(leaderBoardOfUsers);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
