require('dotenv').config()
var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
require('../models/Product');
const Product = mongoose.model('Products');
require('../models/CartItem');
const CartItem = mongoose.model('CartItems');

// Middlewear to report auth status
const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    // authenticated
    next();
  } else {
    res.render('users/not_auth')
  }
}

/* GET listing of all campaigns */
router.get('/', (req, res, next) => {

  Product.find({})
  .then( Products => {
    res.render('products/index', { title: "Products | Web Store", productList: Products})
  });
});

/* GET add to cart */
router.get('/add-cart',ensureAuth, (req, res, next) => {

  Product.findOne({ _id: req.query._id })
  .then( Product => {
      const newCartItem = new CartItem( {
        user_id: req.user.providerID,
        name: Product.name,
        desc: Product.desc,
        price: Product.price,
        imgURL: Product.imgURL
      } )
    newCartItem
      .save()
      .then( () => { res.render(`products/add-cart`, { title: "Cart Item | Web Store", product: Product, newCartItem} ) } )
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