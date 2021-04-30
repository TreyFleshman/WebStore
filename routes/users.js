require('dotenv').config()
var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/User.js');
var session = require('express-session');
var connection = require('../services/db');
var GoogleStrategy = require ('passport-google-oauth').OAuth2Strategy;

const mongoose = require('mongoose');
require('../models/Order');
const Order = mongoose.model('Order');

require('../services/passport_google');

/* GET user profile */
router.get('/',  async function(req, res, next) {
  // If user loged in
  if(req.isAuthenticated() ) {
    loggedInUser = req.user;
    Order.find({user_id: req.user.providerID})
    .then(orders => {
        res.render('users/user_profile', {
        title: 'Profile | Web Store',
        displayName: loggedInUser.displayName,
        email: loggedInUser.email,
        userImage: loggedInUser.picture,
        orders: orders
        })
    })
  } else { res.render('users/not_auth'); }
});

/* GET to Google login */
router.get('/login', 
  passport.authenticate('google', { scope: ['profile', 'email'] } )
);

/* GET Logout */ 
router.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy((err) => {
      if (err) return next(err);
      return res.redirect('/users/');
    })
  }
);

/* GET to Google return */
router.get('/return', 
  passport.authenticate('google', { failureRedirect: '/users/login' } ),
  function( req, res ){
    res.redirect('/users/')
  }
);


module.exports = router;


const selectUsers = async function(callback) {
  console.log('Selecting Users to view!');

    connection.query(`SELECT * FROM user`,
    function(error, results, fields){
        if (error) throw error;
        callback(results);
    }) 
};


/* //Select All Users
selectUsers( function (results){
    console.log(results);
})
*/