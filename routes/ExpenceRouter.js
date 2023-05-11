const express = require("express");
const expenseController = require("../controllers/ExpenceCon");
const authenticate = require('../middleware/auth')


const Route = express.Router();

Route.post("/addExpense", authenticate, expenseController.addExpense);
Route.get("/getExpenses", authenticate, expenseController.getExpense);
Route.delete("/deleteExpense/:id", authenticate, expenseController.deleteExpense);
Route.get("/download", authenticate, expenseController.downloadExpense);

module.exports = Route;
