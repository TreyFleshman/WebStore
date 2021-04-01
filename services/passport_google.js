  
require('dotenv').config();
var passport = require('passport');
var GoogleStrategy = require ('passport-google-oauth').OAuth2Strategy;

const mongoose = require('mongoose');
const User = mongoose.model('Users');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},
  function(accessToken, refreshToken, profile, cb){
    // Check if users needs to be in the database

    const newUser = {
      provide: 'Google',
      providerID: profile.id,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      displayName: profile.displayName,
      email: profile.emails[0].value,
      picture: profile.photos[0].value,
      providerProfile: profile
    }

    // Check for existing user

    User.findOne({
        providerID: profile.id
    })
    .then(user => {
      if (user) {
        console.log('A user is found in the databse!');
        cb(null, user);
      } else { 
        // Create User
        new User(newUser)
        .save()
        .then(user => cb(null, user) );
      }
    })
  })
);

passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});