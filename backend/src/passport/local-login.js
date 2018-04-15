/**
 * Created by StarkX on 12-Mar-18.
 */
const LocalStrategy = require('passport-local').Strategy;
const error = require('../lib/error');
const User = require('mongoose').model('User');

module.exports = function (passport) {
    
    const next = (req, emailOrHandle, password, done) => {
        return User.getUser(emailOrHandle, password)
            .then((user) => {
                if (!user)
                    return done(new error.InvalidRequestError('invalid_user'));
                done(null, user);
            })
            .catch((err) => done(new error.ServerError(err)));
    };
    
    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    }, next));
};