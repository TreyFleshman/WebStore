require('dotenv').config()
var express = require('express');
var router = express.Router();

// Middlewear to report auth status
const userCheck = (req, res, next) => {
  
}

/* GET home page. */
router.get('/', function(req, res, next) { 
  if (req.isAuthenticated()) {
    res.render('index', { title: 'Web Store', userImage: req.user.picture});
  } else {
    res.render('index', { title: 'Web Store'});
  }       
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
