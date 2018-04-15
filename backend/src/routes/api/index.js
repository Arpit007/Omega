/**
 * Created by StarkX on 08-Mar-18.
 */
const express = require('express');
const router = express.Router();
const Response = require('../../response');
const authorise = require('../auth');

router.get('/api/logout', (req, res) => {
    req.logout();
    Response.ResponseReply(res);
});

router.use((req, res, next) => iPassport.authenticate('jwt', { session : false },
    (error, user, info, status) => {
        if (user) req.user = user;
        next();
    })(req, res, next));

router.use('/auth', (req, res, next) => {
    if (req.isAuthenticated())
        return Response.ResponseReply(res, 200, xConfig.debugMode ? { 'token' : req.token } : {});
    next();
}, require('./auth'));

router.get('/app', (req, res) => Response.ResponseReply(res, 200, { app : xConfig.appName }));
router.get('/', authorise.apiAuthorise, (req, res) => Response.ResponseReply(res, 200, { app : xConfig.appName }));

module.exports = router;
