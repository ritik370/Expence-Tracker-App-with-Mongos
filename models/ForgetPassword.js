const sequelize = require("sequelize");
const Sequelize = require("../util/database");

const ForgetPassword = Sequelize.define("forgetpassword", {
  id: {
    type: sequelize.UUID,
    allowNull: false,
    primaryKey: true,
  },
  isactive: sequelize.BOOLEAN,
  userId:sequelize.TEXT
});

module.exports = ForgetPassword;
