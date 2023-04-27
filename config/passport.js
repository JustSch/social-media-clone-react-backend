const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/user');



module.exports = function(passport) {
    
    passport.use(
      new LocalStrategy({ usernameField: 'email' },  async (email, password, done) => {
     
        const user = await User.find({ email: email });
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }
        bcrypt.compare(password, user[0].password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user[0]);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });


      })
    );
  
    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });
  
    passport.deserializeUser(async function(id, done) {
      const user = await User.findById(id);
      done(null, user);
    });
  };