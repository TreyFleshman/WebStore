require('dotenv').config()
var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const dateFormat = require('dateformat');

require('../models/Product');
const Product = mongoose.model('Products');
require('../models/CartItem');
const CartItem = mongoose.model('CartItems');
require('../models/Order');
const Order = mongoose.model('Order');

// Middlewear to report auth status
const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    // authenticated
    next();
  } else {
    res.render('users/not_auth')
  }
}

/* GET to checkout */
router.get('/checkout', (req, res, next) => {
  var total = 0;
  CartItem.find({user_id: req.user.providerID})
    .then( CartItem => {
    for(i=0; i<CartItem.length; i++){
        total = total + CartItem[i].price;
    }
    var tax = total*0.07;
    taxRd = tax;
    tax = tax.toFixed(2);
    var final = total + taxRd;
    final = final.toFixed(2);
    User = req.user;   
    res.render('checkout/checkout', {
     title: "Checkout | Web Store",
     CartItems: CartItem,
     User: User,   
     total,
     final,
     tax,
    })
  })
}); 

/* GET to order details */
router.get('/order', (req, res, next) => {
  CartItem.deleteMany({user_id: req.user.providerID})
  .then(
      Order.findOne({_id: req.query._id})
      .then( orders =>
          res.render('checkout/order', {
            title: "Order Details | Web Store",
            orderDetails: orders,
          })
      )
  )
});

/* POST to create Order */
router.post('/save', ensureAuth, (req,res,next) => {
    console.log('Creating a new Order!') 
    var total = 0;
    CartItem.find({user_id: req.user.providerID})
    .then( CartItems => {
      for(i=0; i<CartItems.length; i++){
        total = total + CartItems[i].price;
      }
      var tax = total*0.07;
      var final = total + tax;
      final = final.toFixed(2);          
      const newOrder = new Order( {
        user_id: req.user.providerID,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        address: req.body.address,
        address2: req.body.address2,
        country: req.body.country,
        state: req.body.state,
        city: req.body.city,
        zip: req.body.zip,
        total: final,
        items: CartItems,        
        order_date: dateFormat(req.body.start_date, "fullDate"),
      });
    newOrder
      .save()
      .then( () => console.log('Order created!') )
      .then( () => console.log(newOrder) )  
      .then( () => { res.redirect('/checkout/order?_id=' + newOrder._id) } )
      .catch( err => console.log(err) )
    })
});

module.exports = router;