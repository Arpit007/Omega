/**
 * Created by StarkX on 08-Mar-18.
 */
const User = require('mongoose').model('User');

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
    
    require('./local-login')(passport);
    require('./local-signup')(passport);
    require('./local-jwt')(passport);
};