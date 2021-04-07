require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var passport = require('passport');
var GoogleStrategy = require ('passport-google-oauth').OAuth2Strategy; 

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var checkoutRouter = require('./routes/checkout');
var electronicsRouter = require('./routes/electronics');


var session = require('express-session');
var MongoStore = require('connect-mongo');
var { v4: uuidv4 } = require('uuid');

var app = express();

// CONNECT to MongoDB via Mongoose
const mongoosePromise = mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
.then( m => m.connection.getClient() )
.catch( err => console.log(err) );

// Set up Session
app.use(session({
  genid: (req) => {
      console.log(req.sessionID);
      return uuidv4();
  },
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 * 2 },
  store: MongoStore.create({
      clientPromise: mongoosePromise
    })
  })
);

//Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Login / logout Views
app.use(function (req, res, next ) {
    if (req.isAuthenticated()) {
        app.set('view options', { layout: 'layout_user'});
    } else {
        app.set('view options', { layout: 'layout'});
    }
    return next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/checkout', checkoutRouter);
app.use('/electronics', electronicsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
