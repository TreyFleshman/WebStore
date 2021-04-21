require('dotenv').config()
var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
require('../models/Electronic');
const Electronic = mongoose.model('Electronics');
require('../models/Product');
const Product = mongoose.model('Products');

/* GET home page. */
router.get('/', async function(req, res, next) { 
  Electronic.find( { name : { $in: [ "Amazon Echo", "Google Home Mini", "Sony Ultra-Portable Speaker" ] } } )
  .then( (data) => {
    Product.find( { name : { $in: [ "Tropical Fish Love Metal Wall Artwork Decor", 
    "The Golden Sailboat Canvas Print", "3 Piece Canvas Giclee Butterflies Painting" ] } } )
    .then( (x) => {      
      console.log(data.length)
      if (req.isAuthenticated()) {
        res.render('index', { title: 'Web Store', data:data, x:x , userImage: req.user.picture});
      } else {
        res.render('index', { title: 'Web Store', data:data, x:x});
      } 
    })
  })    
});

/* GET contact page. */
router.get('/contact', function(req, res, next) {
  var MAPS_API_KEY = process.env.MAPS_API_KEY
  if (req.isAuthenticated()) {
    res.render('contact', { title: 'Contact | Web Store', MAPS_API_KEY,  userImage: req.user.picture});
  } else {
    res.render('contact', { title: 'Contact | Web Store', MAPS_API_KEY});
  } 
});

module.exports = router;