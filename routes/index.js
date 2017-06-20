var express = require('express');
var router = express.Router();
var db = require('../Database/config');


/* GET home page. */


router.get('/', function (req, res, next) {
    db.any('select * from item').then(data => {
        //console.log(data);
        res.render('index', {title: 'Lift-Style', data: data});

    }).catch(error => {
        console.log('Error: ' + error);
    });

});

module.exports = router;
