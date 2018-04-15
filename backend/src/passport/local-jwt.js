/**
 * Created by StarkX on 13-Mar-18.
 */
const JwtStrategy = require('passport-jwt').Strategy;
const User = require('mongoose').model('User');

const opts = {
    secretOrKey : xConfig.crypto.JwtKey,
    jwtFromRequest : (req) => {
        let token = (() => {
            if (req.headers[ 'x-auth-token' ]) return req.headers[ 'x-auth-token' ];
            if (req.session[ 'auth-token' ]) return req.session[ 'auth-token' ];
            if (req.body[ 'auth-token' ]) return req.body[ 'auth-token' ];
            if (req.query[ 'auth-token' ]) return req.query[ 'auth-token' ];
            //return (req.cookies) ? req.cookies[ 'auth-token' ] : null;
            return req.session[ 'auth-token' ];
        })();
        req.token = token;
        return token;
    }
};


module.exports = function (passport) {
    passport.use('jwt', new JwtStrategy(opts, (jwt_payload, done) => {
        return User.findById(jwt_payload.id)
            .then((user) => done(null, user));
    }));
};