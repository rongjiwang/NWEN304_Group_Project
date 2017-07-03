//----Set up application---
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var pg = require('pg');
var session = require('express-session');
var pgSession = require('connect-pg-simple')(session);
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');

var index = require('./routes/index');
var user = require('./routes/user');
/* Init app */
var app = express();


require('./Database/passport');
//var cn = process.env.DATABASE_URL || "postgres://alcancal:helloworld@depot:5432/alcancal_jdbc";
var cn = process.env.DATABASE_URL || "postgres://localhost:5432/rongjiwang";


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(validator());
app.use(cookieParser());
app.use(session({
    store: new pgSession({conString: cn}),
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    cookie: {maxAge: 30 * 24 * 60 * 60 * 1000} // 30 days
}));
// required for passport
app.use(flash());
app.use(passport.initialize());
app.use(passport.session()); // To store users

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.locals.login = req.isAuthenticated();
    res.locals.user = req.user;
    res.locals.session = req.session;
    next();
});

app.use('/', index);
app.use('/user', user);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
