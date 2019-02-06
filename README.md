# Bamazon Node.js Application
The purpose of this application is to allow a customer to purchase a product and allow a manager to update and create inventory listings.

## Customer Interface
When the customer file is initiated it will give them a list of avaliable products products from the database and then ask them what they would like to buy.

![customer start](/images/custStart.PNG)
![database start](/images/dbStartCustomer.PNG)

After the user selects a product and the number they would like to buy of the product, the program will give a total for the purchase. The database will update to reflect the new inventory of a product.

![purchase](/images/purchase.PNG)
![database post purchase](/images/dbPostPurchase.PNG)

If the user tries to buy more than of a product that there is stock of, it will tell the user that there isn't enough and to restart their purchase.

![over purchase](/images/overPurchase.PNG)
## Manager Interface
