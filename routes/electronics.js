require('dotenv').config()
var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');

const mongoose = require('mongoose');
require('../models/CartItem');
const CartItem = mongoose.model('CartItems');
require('../models/Electronic');
const Electronic = mongoose.model('Electronics');

// Middlewear to report auth status
const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    // authenticated
    next();
  } else {
    res.render('users/not_auth', {userImage: req.user.picture})
  }
}

router.get('/', (req, res, next) => {
    Electronic.find({})
    .then( x => {
      res.render('electronics/index', { title: "Products | Web Store", x:x, userImage: req.user.picture})
    })
});

router.get('/sortPriceDesc', (req,res,next) => {
    fetch('https://us-central1-cit412-treyfles-final-webstore.cloudfunctions.net/SortByPriceDesc_Electronics')
    .then(res => res.json())
    .then( (data) => {
       res.render('electronics/index', { title: "Products | Web Store", x:data, userImage: req.user.picture})
    })
});

router.get('/sortPriceAsc', (req,res,next) => {
    fetch('https://us-central1-cit412-treyfles-final-webstore.cloudfunctions.net/SortByPriceDesc_Electronics')
    .then(res => res.json())
    .then( data => data.reverse())
    .then( (data) => {
       res.render('electronics/index', { title: "Products | Web Store", x:data, userImage: req.user.picture})
    })
});

/* GET add to cart */
router.get('/add-cart',ensureAuth, (req, res, next) => {

  Electronic.findOne({ _id: req.query._id })
  .then( Electronic => {
      const newCartItem = new CartItem( {
        user_id: req.user.providerID,
        name: Electronic.name,
        desc: Electronic.desc,
        price: Electronic.price,
        imgURL: Electronic.imgURL
      } )
    newCartItem
      .save()
      .then( () => { res.render(`electronics/add-cart`, { 
        title: "Cart Item | Web Store", 
        electronic: Electronic,
        newCartItem,
        userImage: req.user.picture
      } ) } )
      .catch( err => console.log(err) )
    } )
});

/* GET to cart */
router.get('/cart', ensureAuth, (req, res, next) => {
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
    res.render('products/cart', {
     title: "Cart | Web Store",
     userImage: req.user.picture,
     CartItems: CartItem,     
     total,
     final,
     tax,
     
    })
  })
});

/* GET to delete from cart */
router.get('/cart-item-del', (req, res, next) => {
  CartItem.deleteOne({ _id: req.query._id })
  .then(
    res.redirect('/products/cart')
  )
});


module.exports = router;