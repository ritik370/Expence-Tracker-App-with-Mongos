const sequelize = require("sequelize");
const Sequelize = require("../util/database");

const Expense = Sequelize.define("Userexpenses", {
  id: {
    type: sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  amount: sequelize.BIGINT,
  description: sequelize.STRING,
  category: sequelize.STRING,
  userId:sequelize.BIGINT
});

module.exports = Expense;
