/**
 * Created by StarkX on 12-Mar-18.
 */
const LocalStrategy = require('passport-local').Strategy;
const User = require('mongoose').model('User');

module.exports = function (passport) {
    
    const next = (req, email, password, done) => {
        let fields = {
            handle : req.body.handle,
            email : email,
            password : password
        };
        
        return User.register(fields)
            .then((user) => done(null, user))
            .catch((err) => done(err));
    };
    
    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    }, next));
};