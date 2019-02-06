# Bamazon Node.js Application
The purpose of this application is to allow a customer to purchase a product and allow a manager to update and create inventory listings.

## Challenges
The biggest challenge that I had with this project was getting the validate for the user input to work properly. The documentation for inquirer is a little sparse when it gets into specifics. Eventually, using other resources, I was able to figure out how to get the validate to function properly. 

I was unable to to get the customer's total to round to the proper decimal. That is something that I think I will be able to get working in the future.

## Customer Interface
When the customer file is initiated it will give them a list of avaliable products products from the database and then asks them what they would like to buy.

![customer start](/images/custStart.PNG)
![database start](/images/dbStartCustomer.PNG)

After the user selects a product and the number they would like to buy of the product, the program will give a total for the purchase. The database will update to reflect the new inventory of a product.

![purchase](/images/purchase.PNG)
![database post purchase](/images/dbPostPurchase.PNG)

If the user tries to buy more than of a product that there is stock of, it will tell the user that there isn't enough and to restart their purchase.

![over purchase](/images/overPurchase.PNG)
## Manager Interface
When the manager file is initiated, a list of avaliable actions will be given.
![manager start](/images/managerStart.PNG)

### View Inventory
If View inventory is chosen, a list of everything in the database will be pulled up.

![view Products](/images/viewProduct.PNG)
![database manager start](/images/dbStartManager.PNG)

### View Low Inventory
If View low inventory is chosen, a list of every product with less than 5 units in stock will be listed.

![low inventory](/images/lowInventory.PNG)

### Add Inventory
If Add inventory is chosen, the manager is asked for the id of the product and the number they would like to add. After the information is given the database is updated.

![add inventory](/images/addInventory.PNG)
![database add inventory](/images/dbPostAdd.PNG)

### Add New Product
If Add new Prodect is chosen, the manager will be asked to enter the name of the product, the dapartment it is in, the price per unit, and the number they want to add. The database is updated accordingly.

![create new product](/images/create.PNG)
![database new product](/images/dbAfterCreate.PNG)
