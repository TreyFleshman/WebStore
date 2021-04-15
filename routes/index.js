require('dotenv').config()
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {        
    res.render('index', { title: 'Web Store', userImage: req.user.picture});
});

/* GET contact page. */
router.get('/contact', function(req, res, next) {
  var MAPS_API_KEY = process.env.MAPS_API_KEY
  res.render('contact', { title: 'Contact | Web Store', MAPS_API_KEY, userImage: req.user.picture });
});


module.exports = router;
