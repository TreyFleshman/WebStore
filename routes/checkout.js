require('dotenv').config()
var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const dateFormat = require('dateformat');
const stripe = require('stripe')(process.env.STRIPE_API_KEY);

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
    res.render('users/not_auth', {userImage: req.user.picture})
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
     userImage: req.user.picture     
    })
  })
}); 

/* GET to order details */
router.get('/order', (req, res, next) => {
  CartItem.deleteMany({user_id: req.user.providerID})
  .then(
      Order.findOne({_id: req.query._id})
      .then( orders =>
          res.render('checkout/confirmation', {
            title: "Order Details | Web Store",
            orderDetails: orders,
            userImage: req.user.picture
          })
      )
  )
});

/* POST to create Order */
router.post('/save', ensureAuth, async (req,res,next) => {
    if (req.isAuthenticated()) {
        console.log('Creating a new Order!') 
        var total = 0;
        var customer = await createCustomer(req);       
        var charge = await createCharge(customer, req.user.providerID);
        CartItem.find({user_id: req.user.providerID})
        .then(CartItems => {
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
            charge: charge,
            customer: customer,        
            order_date: dateFormat(req.body.start_date, "fullDate"),
        });
        newOrder
        .save()
        .then( () => console.log('Order created!') )  
        .then( () => { res.redirect('/checkout/order?_id=' + newOrder._id) } )
        .catch( err => console.log(err) )
        })
    }else {
        console.log('Creating a new Order!') 
        var total = 0;
        var orderTotal = getTotal();        
        var customer = await createCustomer(req);
        var charge = await createCharge( customer, 'Anonymous');
        CartItem.find({user_id: req.user.providerID})
        .then( CartItems => {
        for(i=0; i<CartItems.length; i++){
            total = total + CartItems[i].price;
        }
        var tax = total*0.07;
        var final = total + tax;
        final = final.toFixed(2);         
        const newOrder = new Order( {
            user_id: 'Anonymous',
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
            charge: charge,
            customer: customer,        
            order_date: dateFormat(req.body.start_date, "fullDate"),
        });
        newOrder
        .save()
        .then( () => console.log('Order created!') )
        .then( () => { res.redirect('/checkout/order?_id=' + newOrder._id) } )
        .catch( err => console.log(err) )
        })
    }
});

module.exports = router;

//Helper Functions
const createCustomer = async function(req) {
    if (req.isAuthenticated()) {
      var customer = await stripe.customers.create({
        name: req.user.firstName + ' ' + req.user.lastName,
        email: req.user.email,
        source: req.body.stripeToken
      });
    return customer;
    }else {
    var customer = await stripe.customers.create({
      name: 'Anonymous',
      email: null,
      source: req.body.stripeToken
    });
    return customer;
    }
};

const createCharge = async function(customer, user_id) {
    var charge = await stripe.charges.create({
        amount: 1*100,
        currency: 'usd',
        customer: customer.id,
        description: user_id + 'Order',
        metadata: {
            user_id: user_id,
        }
    });
    return charge;
};