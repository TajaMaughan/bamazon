//initiates use of .env file
require("dotenv").config();
//requires other necessary dependencies
var inquirer = require("inquirer");
var mysql = require("mysql");
var cTable = require("console.table");
//accesses password from .env file
var password = process.env.PASSWORD;
//conncects to database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: password,
    database: "bamazon"
});

//declares variable to hold number of items in database
var numOfItems = 0;

//makes product query from database
connection.query("SELECT item_id, product_name, price FROM products", function (err, res) {
    if (err) throw err;
    //uses console.table to format the returned query in a readable table
    numOfItems = res.length;
    var table = cTable.getTable(res);
    console.log("\nProducts avaliable to purchase\n------------------------------\n" + table);
    buy();
})

//gets input from user about what they would like to buy
function buy() {
    inquirer
        .prompt([{
            name: "item",
            type: "input",
            message: "What is the id of the product you would like to buy?",
            //makes sure the the value entered it a positive integer that is avaliable on the items to buy table.
            validate: function(value) {
                var integer = Number.isInteger(parseFloat(value));
                var positive = Math.sign(value);
                if(integer && (positive === 1) && (value <= numOfItems)) {
                    return true;
                } else {
                    return "Please select a valid item id."
                }
            }
        },
        {
            name: "qty",
            type: "input",
            message: "How many would you like to buy?",
            //makes sure the value entered is a positive integer
            validate: function(value) {
                var integer = Number.isInteger(parseFloat(value));
                var positive = Math.sign(value);
                if(integer && (positive === 1)) {
                    return true;
                } else {
                    return "Please enter a number."
                }
            }
        }]).then(function (input) {
            //takes user input and makes sure there is enough of a product to fulfill the users order.
            var item = input.item;
            var qty = input.qty;
            connection.query("SELECT * FROM products WHERE ?", {item_id: item}, function(err,res) {
                if (err) throw err;
                var stock = res[0].stock_quantity;
                if (qty <= stock) {
                    console.log("there is enough in stock");
                } else {
                    console.log("there isn't enough in stock");
                }
            })
        })
}