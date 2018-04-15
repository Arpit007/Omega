/**
 * Created by StarkX on 08-Mar-18.
 */
const express = require('express');
const router = express.Router();
const authorise = require('../auth');

const redirectOnLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
        return res.redirect('/home');
    next();
};

router.get('/auth/logout', (req, res) => {
    req.session[ 'auth-token' ] = null;
    req.logout();
    res.redirect('/auth/login');
});

router.use((req, res, next) => iPassport.authenticate('jwt', {},
    (error, user, info, status) => {
        if (error) console.log(error);
        if (user) req.user = user;
        next();
    })(req, res, next));


router.use('/auth', redirectOnLoggedIn, require('./auth'));

router.get('/home', authorise.webAuthorise, (req, res) => res.render('home.html', {
    req : req,
    title : xConfig.appName
}));

router.get('/', redirectOnLoggedIn, (req, res) => res.render('index.html', { req : req, title : xConfig.appName }));

router.get('/onLogin', authorise.webAuthorise, (req, res) => {
    if (req.user) {
        req.session[ 'auth-token' ] = req.token;
        res.redirect('/home');
    } else res.redirect('/auth/login');
});

module.exports = router;