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

//makes product query from database
connection.query("SELECT item_id, product_name, price FROM products", function (err, res) {
    if (err) throw err;
    //uses console.table to format the returned query in a readable table
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
            message: "What is the id of the product you would like to buy?"
        },
        {
            name: "qty",
            type: "input",
            message: "How many would you like to buy?",
        }]).then(function (input) {
            //takes user input and makes sure there is enough of a product to fulfill the users order.
            var item = input.item;
            var qty = input.qty;
            connection.query("SELECT * FROM products WHERE ?", {item_id: item}, function(err,res) {
                if (err) throw err;
                console.log(res);
            })
        })
}