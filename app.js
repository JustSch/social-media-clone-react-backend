const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const mongoSanitize = require('express-mongo-sanitize');

const db = require('./config/keys').MongoURI;

require('./config/passport')(passport);

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MonogoDB connected...'))
    .catch(err => console.log(err));



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



app.use(mongoSanitize());

app.use(express.json());

app.use('/api',require('./routes/api'));
app.use(express.static(__dirname + '/public'));
const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log('Server running on port: %s', PORT));