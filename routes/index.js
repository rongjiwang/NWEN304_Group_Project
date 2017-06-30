var express = require('express');
var router = express.Router();
var db = require('../Database/config');
var Cart = require('../Database/cart');


/* GET home page. */


router.get('/', function (req, res, next) {
    db.any('select * from item').then(data => {
        //console.log(data);
        res.setHeader('Cache-Control', 'public, max-age=43200');//cache for 12 hours max
        res.render('index', {title: 'Lift-Style', data: data, message: '', hasResult: true});
        
    }).catch(error => {
        console.log('Error: ' + error);
    });

});

router.post('/search', function (req, res, next) {
    console.log(req.body.search);
    var searchResult = [];
    db.any('select * from item')
        .then(data => {
            //console.log(data);
            data.forEach(item => {
                if (item.name.toLowerCase().includes(req.body.search.toLowerCase()))
                    searchResult.push(item);
            });
            if (searchResult.length == 0)
                res.render('index', {
                    title: 'Lift-Style', data: searchResult,
                    message: 'No relevant search result', hasResult: false
                });
            else
                res.render('index', {title: 'Lift-Style', data: searchResult, message: '', hasResult: true});

        })
        .catch(error => {
            console.log('Error: ' + error);
        });

});

router.get('/addItem/:id', (req, res, next) => {
    var productID = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    db.any('select * from item where itemid=$1', [productID])
        .then(data => {
            cart.add(data[0], data[0].itemid);
            req.session.cart = cart;
            //console.log(req.session.cart);
            res.redirect('/');
        })
        .catch(error => {
            console.log('ERROR: ' + error);
        });
});

router.get('/reduceItem/:id', (req, res, next) => {
    var _id = req.params.id;
    console.log(_id);
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.reduceByOne(_id);
    req.session.cart = cart;
    res.redirect('/myCart');

});

router.get('/deleteOrder/:id', (req, res, next) => {
    var _id = req.params.id;
    console.log(_id);
    db.any('update orders set active=false where orderid=$1', [_id])
        .then(data => {
            res.redirect('/user/edit');
        })
        .catch(error => {
            console.log('ERROR: ' + error);
        });

});

router.get('/myCart', (req, res, next) => {
    if (!req.session.cart)
        return res.render('shopping/cart', {products: null});
    var cart = new Cart(req.session.cart);
    res.render('shopping/cart', {products: cart.generateArray(), totalPrice: cart.totalPrice})
});

router.get('/purchase', isLoggedIn, (req, res, next) => {
    var user = req.user;
    var cart = req.session.cart;
    if (!user) {
        req.flash('error', 'Login before start purchasing.');
        res.redirect('user/signin');
    }
    else {
        db.any('insert into orders values(default,$1,$2,$3,$4,$5,true) returning orderid'
            , [cart, cart.totalQty, cart.totalPrice, user[0].userid, user[0].username])
            .then(data => {
                //console.log(data[0].orderid + ' ' + user[0].userid);
                req.session.cart = null;
                res.redirect('myCart');
            })
            .catch(error => {
                console.log('ERROR: ' + error);
            });
    }

});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}

//todo manager can disable user history from user cart
