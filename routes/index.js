var express = require('express');
var router = express.Router();
var db = require('../Database/config');

/* GET home page. */


router.get('/', function (req, res, next) {
    db.any('select * from item').then(data => {
        //console.log(data);
        res.render('index', {title: 'Lift-Style', data: data, message: '', hasResult: true, user: req.user});

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
module.exports = router;


