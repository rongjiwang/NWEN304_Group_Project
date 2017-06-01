var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('register', {
  	title: "This is the register page"
  });
});

module.exports = router;
