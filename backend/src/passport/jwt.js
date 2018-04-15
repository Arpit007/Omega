/**
 * Created by StarkX on 08-Mar-18.
 */
const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User');

const createToken = (user) => {
    return jwt.sign({
        id : user.id
    }, xConfig.crypto.JwtKey, {
        expiresIn : xConfig.crypto.JwtExpiry
    });
};

module.exports.generateApiToken = (req, res, next) => {
    req.token = createToken(req.auth);
    res.setHeader('x-auth-token', req.token);
    next();
};

module.exports.generateWebToken = (req, res, next) => {
    req.token = createToken(req.auth);
    res.setHeader('x-auth-token', req.token);
    req.session['auth-token'] = req.token;
    next();
};