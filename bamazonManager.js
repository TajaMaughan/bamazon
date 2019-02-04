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
        var table = cTable.getTable(res);
        console.log("\n" + table);
        //does the user want to do anything else?
        doMore();
    })
}

//Pulls up products with stock_quantity less that 5
function viewLow() {
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;
        var table = cTable.getTable(res);
        console.log("\n" + table);
        //does the user want to do anything else?
        doMore();
    })
}

//allows manager to add inventory to an items stock
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
                    return "Please select a valid item id.";
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
                    return "Please enter a number.";
                }
            }
        }]).then(function (input) {
            var item = input.item;
            var qty = input.qty;
            //the mySQL command to access a specific item
            connection.query("SELECT * FROM products WHERE item_id = ?", item, function (err, res) {
                if (err) throw err;
                var stock = res[0].stock_quantity;
                var changeQty = +stock + +qty;
                //command to update items stock quantity
                connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [changeQty, item]);
                //does the user want to do anything else?
                doMore();
            })
        })
}

function newProd() {
    inquirer
        .prompt([{
            name: "item",
            type: "input",
            message: "What is the item you would like to add?",
            validate: function (input) {
                if(input === "") {
                    return "Please enter the items name.";
                }
                return true;
            }
        },
        {
            name: "department",
            type: "input",
            message: "What department does it belong to?",
            validate: function (input) {
                if(input === "") {
                    return "Please enter the department";
                }
                return true;
            }
        },
        {
            name: "price",
            type: "input",
            message: "What is the price per unit?",
            validate: function (input) {
                //makes sure the price is positive.
                var positive = Math.sign(input);
                if(input !== NaN && (positive !== 1)) {
                    return "Please enter a valid price.";
                }
                return true;
            }
        },
        {
            name: "qty",
            type: "input",
            message: "How many of the item are you adding?",
            validate: function (value) {
                //makes sure the value entered is a positive integer
                var integer = Number.isInteger(parseFloat(value));
                var positive = Math.sign(value);

                if (integer && (positive === 1)) {
                    return true;
                } else {
                    return "Please enter a valid number.";
                }
            }
        }]).then(function (answers) {
            var item = answers.item;
            var department = answers.department;
            var price = answers.price;
            var qty = answers.qty;
            //creates new row in database
            connection.query("INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)", [item, department, price, qty]);
            //does the user want to do anything else?
            doMore();
        })
}

//function to find out if the user wants to do anything else
function doMore() {
    inquirer
        .prompt({
            name: "doMore",
            type: "confirm",
            message: "Is there anything else you would like to do?"
        }).then(function (answer) {
            answer = answer.doMore;
            if (answer === true) {
                //if the user selects yes, it goes back to the first menu
                determine();               
            } else {
                //if the user says no, the connection to the database is ended.
                console.log("Terminating session")
                connection.end();
            }
        })
}

determine();