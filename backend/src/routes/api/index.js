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

router.use('/auth', require('./auth'));

router.get('/home', authorise.apiAuthorise, (req, res) => Response.ResponseReply(res, 200, { app : xConfig.appName }));

router.get('/', (req, res) => Response.ResponseReply(res, 200, { app : xConfig.appName }));

module.exports = router;
