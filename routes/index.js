var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {        
    res.render('index', { title: 'Web Store'});
});

/* GET contact page. */
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact | Web Store' });
});

module.exports = router;
