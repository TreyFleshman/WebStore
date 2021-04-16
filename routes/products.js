require('dotenv').config()
var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');

const mongoose = require('mongoose');
require('../models/Product');
const Product = mongoose.model('Products');
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
    res.render('users/not_auth')
  }
}

/* GET listing of all campaigns */
router.get('/', (req, res, next) => {

  Product.find({})
  .then( Products => {
    if (req.isAuthenticated()) {
      res.render('products/index', { title: "Products | Web Store", productList: Products, userImage: req.user.picture})
    } else {
      res.render('products/index', { title: "Products | Web Store", productList: Products})
    } 
  });
});

router.get('/sortPriceDesc', (req,res,next) => {
    fetch('https://us-central1-cit412-treyfles-final-webstore.cloudfunctions.net/SortByPrice_Products')
    .then(res => res.json())
    .then( (data) => {
      if (req.isAuthenticated()) {
        res.render('products/index', { title: "Products | Web Store", productList:data, userImage: req.user.picture})
      } else {
        res.render('products/index', { title: "Products | Web Store", productList:data})
      } 
    })
});

router.get('/sortPriceAsc', (req,res,next) => {
    fetch('https://us-central1-cit412-treyfles-final-webstore.cloudfunctions.net/SortByPrice_Products')
    .then(res => res.json())
    .then( data => data.reverse())
    .then( (data) => {
      if (req.isAuthenticated()) {
        res.render('products/index', { title: "Products | Web Store", productList:data, userImage: req.user.picture})
      } else {
        res.render('products/index', { title: "Products | Web Store", productList:data})
      }
    })
});

router.get('/sortAtoZ', (req,res,next) => {
    fetch('https://us-central1-cit412-treyfles-final-webstore.cloudfunctions.net/SortAtoZ_Products')
    .then(res => res.json())
    .then( (AtoZ) => {
      if (req.isAuthenticated()) {
        res.render('products/index', { title: "Products | Web Store", productList:AtoZ, userImage: req.user.picture})
      } else {
        res.render('products/index', { title: "Products | Web Store", productList:AtoZ})
      }
    })
});

router.get('/sortZtoA', (req,res,next) => {
    fetch('https://us-central1-cit412-treyfles-final-webstore.cloudfunctions.net/SortAtoZ_Products')
    .then(res => res.json())
    .then( AtoZ => AtoZ.reverse())
    .then( (AtoA) => {
      if (req.isAuthenticated()) {
        res.render('products/index', { title: "Products | Web Store", productList:AtoA, userImage: req.user.picture})
      } else {
        res.render('products/index', { title: "Products | Web Store", productList:AtoA})
      }
    })
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
      .then( () => { 
        res.render(`products/add-cart`, { 
          title: "Cart Item | Web Store",
          userImage: req.user.picture,
          product: Product,
          newCartItem
        }) 
      })
    .catch( err => console.log(err) )
  })
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