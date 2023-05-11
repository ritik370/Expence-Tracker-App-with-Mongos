const {Sequelize,DataTypes} = require("sequelize");
const sequelize = require("../util/database");

const User = sequelize.define("UserSignUp", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
  },
  ispremiumuser: DataTypes.BOOLEAN,
  totalExpenses: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

module.exports = User;
