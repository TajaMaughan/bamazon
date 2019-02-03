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
    numOfItems = res.length;//assigns number of items in database
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
            message: "What is the id of the product you would like to buy?",
            validate: function (value) {
                //makes sure the the value entered it a positive integer that is avaliable on the items to buy table.
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
            message: "How many would you like to buy?",           
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
        }]).then(function (input) {
            //takes user input and makes sure there is enough of a product to fulfill the users order.
            var item = input.item;
            var qty = input.qty;
            connection.query("SELECT * FROM products WHERE item_id = ?", item, function (err, res) {
                if (err) throw err;                
                var result = res[0];//query result                
                var stock = result.stock_quantity;//number in stock from query                
                var changeQty = stock - qty;//difference between the qty in stock and the user request qty               
                var price = result.price * qty;//total price of requested qty
                
                if (qty <= stock) {//if stock is greater then the user request...
                    //update the qty in the database, subtracting the number the user bought.
                    connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [changeQty, item]);
                    console.log("\nPurchase successful! You're total was $" + price + ".");
                    //end connection to the server.
                    connection.end();               
                } else {//if stock is less than user request, let user know there wasn't enough, then have them retry their purchase.
                    console.log("\nThere isn't enough of that product in stock. Please restart your purchase.\n");
                    buy();
                }
            })
        })
}