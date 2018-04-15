/**
 * Created by StarkX on 13-Mar-18.
 */
const User = require('mongoose').model('User');
const error = require('../lib/error');

module.exports.apiAuthorise = (req, res, next) => {
    if (!req.isAuthenticated()){
        let err = new error.AccessDeniedError("user_not_authenticated");
        return res.status(err.head.code).json(err);
    }
    next();
};

module.exports.webAuthorise = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.path;
        return res.redirect('/auth/login');
    }
    next();
};