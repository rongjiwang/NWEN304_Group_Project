var express = require('express');
var router = express.Router();
var db = require('../Database/config');
var csrf = require('csurf');

/* Mid-ware */
var csrfProtection = csrf();
router.use(csrfProtection);
/* GET home page. */
router.get('/', function (req, res, next) {
    db.any('select * from item').then(data => {
        console.log(data);
        res.render('index', {title: 'Lift-Style', data: data});

    }).catch(error => {
        console.log('Error: ' + error);
    });

});

router.get('/user/signup', function(req,res,next){
    res.render('user/signup', {csrfToken: req.csrfToken()});
});

router.post('/user/signup', function(req,res,next){
    res.redirect('/');
});

module.exports = router;
