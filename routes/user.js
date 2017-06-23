var express = require('express');
var router = express.Router();
var db = require('../Database/config');
var csrf = require('csurf');
var passport = require('passport');
var Cart = require('../Database/cart');

/* Mid-ware protection*/
var csrfProtection = csrf();
router.use(csrfProtection);


router.get('/profile', isLoggedIn, (req, res, next) => {
    db.any('select * from orders where userid=$1 and active=$2', [req.user[0].userid, true])
        .then(data => {
           // console.log(data[0].cart.items[1].qty);
            var carts;
            data.forEach((order) => {
                carts = new Cart(order.cart);
                order.items = carts.generateArray();
            });
            res.render('user/profile', {orders: data});
        })
        .catch(error => {
            console.log('Error: 1' + error);
        });
});

router.get('/logout', isLoggedIn, (req, res, next) => {
    req.logout();
    res.redirect('/');
});

router.use('/', notLoggedIn, (req, res, next) => {
    next();
});

router.get('/signup', function (req, res, next) {
    let message = req.flash('error');
    res.render('user/signup', {csrfToken: req.csrfToken(), message: message, hasErrors: message.length > 0});
});

router.post('/signup', passport.authenticate('local.signup', {
    failureRedirect: '/user/signup',
    failureFlash: true
}), (req, res, next) => {
    if (req.session.oldUrl) {
        let oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect('/myCart');
    } else {
        res.redirect('/');
    }
});

router.get('/signin', (req, res, next) => {
    let message = req.flash('error');
    res.render('user/signin', {csrfToken: req.csrfToken(), message: message, hasErrors: message.length > 0});
});

router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/user/signin',
    failureFlash: true
}), (req, res, next) => {
    if (req.session.oldUrl) {
        let oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect('/myCart');
    } else {
        res.redirect('/');
    }
});


router.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/user/signin',
        failureFlash: true
    }));

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated())
        return next();
    res.redirect('/');
}