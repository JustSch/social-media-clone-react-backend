const express = require('express');
const router = express.Router();
const app = express();
const mongoose = require('mongoose');
const expressEjsLayout = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const mongoSanitize = require('express-mongo-sanitize');

const db = require('./config/keys').MongoURI;

require('./config/passport')(passport);

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MonogoDB connected...'))
    .catch(err => console.log(err));


app.use(expressEjsLayout);
app.set('view engine','ejs');

app.use(express.urlencoded({extended : true}));

app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());


app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });

app.use(mongoSanitize());

app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));
app.use('/posts',require('./routes/posts'));

app.use(express.static(__dirname + '/public'));
const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log('Server running on port: %s', PORT));