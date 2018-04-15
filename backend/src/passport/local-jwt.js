/**
 * Created by StarkX on 13-Mar-18.
 */
const JwtStrategy = require('passport-jwt').Strategy;
const User = require('mongoose').model('User');

const opts = {
    secretOrKey : xConfig.crypto.JwtKey,
    jwtFromRequest : (req) => {
        if (req.headers[ 'x-auth-token' ]) return req.headers[ 'x-auth-token' ];
        //return (req.cookies) ? req.cookies[ 'auth-token' ] : null;
        return req.session[ 'auth-token' ];
    }
};


module.exports = function (passport) {
    passport.use('jwt', new JwtStrategy(opts, (jwt_payload, done) => {
        return User.findById(jwt_payload.id)
            .then((user) => done(null, user));
    }));
};