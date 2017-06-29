var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.setHeader('Cache-Control', 'public, max-age=86400'); //cache for 1 day
  res.render('register', {
  	title: "This is the register page"
  });
});

module.exports = router;
