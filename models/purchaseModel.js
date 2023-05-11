const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Order = sequelize.define("orders", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  userId: Sequelize.STRING,
  orderid: Sequelize.STRING,
  status: Sequelize.STRING,

});

module.exports = Order;
