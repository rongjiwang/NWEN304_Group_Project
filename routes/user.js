var express = require('express');
var router = express.Router();
var db = require('../Database/config');
var csrf = require('csurf');
var passport = require('passport');

/* Mid-ware protection*/
var csrfProtection = csrf();
router.use(csrfProtection);



router.get('/profile', isLoggedIn, (req, res, next) => {
    res.render('user/profile');
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
    successRedirect: '/user/signin',
    failureRedirect: '/user/signup',
    failureFlash: true
}));

router.get('/signin', (req, res, next) => {
    let message = req.flash('error');
    res.render('user/signin', {csrfToken: req.csrfToken(), message: message, hasErrors: message.length > 0});
});

router.post('/signin', passport.authenticate('local.signin', {
    successRedirect: '/',
    failureRedirect: '/user/signin',
    failureFlash: true
}));


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