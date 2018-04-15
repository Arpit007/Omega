/**
 * Created by StarkX on 08-Mar-18.
 */
const express = require('express');
const router = express.Router();
const authorise = require('../auth');

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

router.use('/auth', (req, res, next) => {
    if (req.isAuthenticated())
        return res.redirect('/');
    next();
}, require('./auth'));

router.get('/app', (req, res) => res.render('app.html', { req : req, title : xConfig.appName }));
router.get('/', authorise.webAuthorise, (req, res) => res.render('index.html', { req : req, title : xConfig.appName }));

module.exports = router;