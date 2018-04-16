/**
 * Created by StarkX on 11-Mar-18.
 */
const express = require('express');
const router = express.Router();
const auth = require('../../passport/jwt');
const error = require('../../lib/error');
const Response = require('../../response');
const mongoose = require('mongoose');
const activeUsers = require('../../lib/activeUsers');

const passport = iPassport;

const authenticate = (strategy) => {
    return (req, res, next) => {
        passport.authenticate(strategy, {
            failureFlash : true,
            session : false
        }, (err, user, info, status) => {
            if (err) return res.status(err.head.code).json(err);
            if (info && info.message === 'Missing credentials') {
                let err = new error.InvalidRequestError('missing_parameter');
                return res.status(err.head.code).json(err);
            }
            req.user = user;
            next();
        })(req, res, next);
    };
};

const validate = (req, res, next) => {
    if (!req.user) {
        let err = new error.UnauthorizedClientError('user_not_authenticated');
        return res.status(err.head.code).json(err);
    }
    req.auth = { id : req.user.id };
    next();
};

const postAuth = (req, res, next) => {
    Response.ResponseReply(res, 200, xConfig.debugMode ? { 'auth-token' : req.token } : {});
};


router.post('/deviceLogout', (req, res) => {
    let deviceModel = mongoose.model('Device');
    return deviceModel.getDeviceByToken(req.token)
        .then((device) => {
            if (!device) return Response.ResponseReply(res);
            req.user.devices.splice(req.user.devices.indexOf(device._id), 1);
            
            device.download.forEach((download) => {
                /*Todo: Delete Downloaded Files*/
            });
            return device.remove();
        })
        .then(() => req.user.save())
        .then(() => req.logout())
        .then(() => Response.ResponseReply(res))
        .catch((e) => {
            e = new error.ServerError(e);
            res.status(e.head.code).json(e);
        });
});

router.use((req, res, next) => {
    if (req.isAuthenticated())
        return Response.ResponseReply(res, 200, xConfig.debugMode ? { 'auth-token' : req.token } : {});
    next();
});

/*************************************************Local Login**********************************************************/
router.post('/login', authenticate('local-login'), validate, auth.generateApiToken, postAuth);

/*************************************************Local Signup*********************************************************/
router.post('/signup', authenticate('local-signup'), validate, auth.generateApiToken, postAuth);

router.post('/deviceLogin', authenticate('local-login'), validate, auth.generateApiToken, (req, res, next) => {
    let deviceModel = mongoose.model('Device');
    return deviceModel.login(req.user, req.token)
        .then((device) => {
            req.user.devices.push(device._id);
            activeUsers.addDevice(req.user, device);
            return req.user.save();
        })
        .then(() => next())
        .catch((e) => {
            e = new error.ServerError(e);
            res.status(e.head.code).json(e);
        });
}, postAuth);

module.exports = router;