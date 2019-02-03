require("dotenv").config();
var inquirer = require("inquirer");
var mysql = require("mysql");
var cTable = require("console.table");
var password = process.env.PASSWORD;
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: password,
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    list();
})

function list() {
    connection.query("SELECT item_id, product_name, price FROM products", function (err, res) {
        if (err) throw err;
        result = res;
        var table = cTable.getTable(res);
        console.log(table);
    })
    buy();
}

function buy() {
    inquirer
        .prompt({
            name: "buy",
            type: "input",
            message: "What is the id of the product you would like to buy?",
            validate: function() {
                return (buy !== NaN);
            }
        })
}