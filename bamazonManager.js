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


//find out what the manager would like to do.
function determine() {
    inquirer
        .prompt({
            name: "determine",
            type: "list",
            message: "What would you like to do?",
            choices: ['View products for sale', 'View low inventory', 'Add inventory', 'Add new product']
        }).then(function (input) {
            var answer = input.determine;
            //calls function depending on manager answer
            switch (answer) {
                case 'View products for sale':
                    viewProd();
                    break;
                case 'View low inventory':
                    viewLow();
                    break;
                case 'Add inventory':
                    addInv();
                    break;
                case 'Add new product':
                    newProd();
                    break;
                default:
                    console.log("no");
            }
        })
}

//Pulls up table of current inventory
function viewProd() {
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function (err, res) {
        if (err) throw err;
        var table = cTable.getTable("\n" + res);
        console.log(table);
    })
    connection.end();
}

//Pulls up products with stock_quantity less that 5
function viewLow() {
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;
        var table = cTable.getTable("\n" + res);
        console.log(table);
    })
    connection.end();
}

//
function addInv() {
    //declares variable to hold number of items in database
    var numOfItems = 0;
    //call query to get number of items in database
    connection.query("SELECT item_id FROM products", function (err, res) {
        if (err) throw err;
        numOfItems = res.length;//assigns number of items in database
    })
    inquirer
        .prompt([{
            name: "item",
            type: "input",
            message: "What is the id of the product you would like to add inventory to?",
            validate: function (value) {
                //makes sure the the value entered it a positive integer that is avaliable on the items table.
                var integer = Number.isInteger(parseFloat(value));
                var positive = Math.sign(value);

                if (integer && (positive === 1) && (value <= numOfItems)) {
                    return true;
                } else {
                    return "Please select a valid item id."
                }
            }
        },
        {
            name: "qty",
            type: "input",
            message: "How many would you like to add?",
            validate: function (value) {
                //makes sure the value entered is a positive integer
                var integer = Number.isInteger(parseFloat(value));
                var positive = Math.sign(value);

                if (integer && (positive === 1)) {
                    return true;
                } else {
                    return "Please enter a number."
                }
            }
        }]).then()
}

function newProd() {

}

determine();