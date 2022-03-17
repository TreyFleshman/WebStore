# E-Commerece Web Store

https://cit412-treyfles-final-webstore.uc.r.appspot.com/

## Page Description

### Home
Users will be taken to our landing page or 'Home' page when they open the website. The Home page display's 6 products, 3 from our normal product selection and 3 from our electronic products. This is our 'Featured Product' section. These products can be added to the users cart but the user must first log in with Google useing the login button on the navigation bar. We track the users cart using their Google ID, making sure they only see the products they have added to their cart. Users can also select to view all products by pressing the 'Products' or 'Electronics' button below the corresponding featured product tab. The users data is collected and stored into a SQL database so we can refrence the user throughout the site.

### Products & Electronics
We used an Amazon product pricing CSV file to import the prouct data into our site. We also used an online electronic product CSV file to import the electronic product data. This information is stored within a Mongo database which we use Mongoose to access. Products are displayed with a image thumbnail,  product name and description and the price of the product. On the electronics page the brand of the product is also displayed. At the bottom there is a button that allows the user to add the product to their cart. 

### Add to Cart
This page is displayed after a user press the add to cart button on any page. This allows the user to visualy see that this product has been added to their cart and allows the users to either 'Contuine Shopping' or 'View Cart' by selecting on of the two buttons displayed on the page.

### Cart
The users cart displays a list of all the products that they have added to thier cart. This page displays the product image, name, description and price of the product. As well as a button to remove a certain item from the users cart if they decide they no longer want this item. The page will calculate the total of the products, the tax ( 0.07 ) and produce a total for the order. The user can then select to checkout if they are happy with the items in their cart.

### Checkout
The checkout page allows users to pay for the items in their cart. This page collects extra informaton about the user like their address for shipping and their payment information. Again the products they are buying are displayed on this page incase the user changes their mind on what products to buy. When the user is ready they can enter their payment information which is process by Stripe. When the user has entered all their information they select the 'Place Order' button to place their order.

### Order Confirmation
This page shows a summary of the users order and a confirmation that the payment has went through. This page shows all the users information including name, email and shipping address. This page also displays what card the user used, the toal of the order and an order number and confirmation number. The order summary will display all items the user order as well so the user knowns what products were ordered. This order information is stored within a Mongo Collection. 

### Users
This page will show the current user that is logged in and their imformation. This includes profile image, name and email. This page also displays all orders that this user has made listed by order number. The user can click on these orders to view the order summary. The user also has the option to log out form this page.

### Contact Us
This page displays information to mock a real contact us page, information displayed includes address, email and phone number as well as a Google Map with the stores locaiton. This was added using a Google Maps API.

## Filters on Products Pages

### Google Cloud Filters
The filters work by using a Google Cloud Function to connect to Mongo Db by Mongo-Connect, they then find all prodcts sorting by Price ascending / descending and by name A-Z / Z-A. Then it displays a simple JSON object to a webpage. This Cloud Function is triggered by a HTTP request. When a user presses a filter button, the webpage will use a fetch command to fetch this JSON object from the outside web address and bring this information into our site and display this information to the user.

### Mongo Aggregation
The other set of filters that filter products by price range use a Mongo Aggregation to find products that are greater than a certain ammount but also less than a certain ammount. It then takes this filter and apply's it to the Mongo DB query.

## Packages Used
* Mongoose
* Passport
* Google O-Auth
* MySQL
* Stripe
* Node Fetch
* Date Format
* UUID

## Utilities

* Google Cloud App Engine for Hosting
* Google Cloud Platform
* Google Cloud Functions
* Google Maps API
* Cloud SQL
* Express
* Mongo DB
* Stripe Payment Processing
* Google Authentication


### Dev Team 
Trey Fleshman, Austin Fickle, Nancy Bailey, Douglas Greathouse and Damanvir Chohan

*IUPUI CIT 41200 Fall Semester 2020-2021*
