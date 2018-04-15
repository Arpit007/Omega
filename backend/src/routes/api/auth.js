/**
 * Created by StarkX on 11-Mar-18.
 */
const express = require('express');
const router = express.Router();
const auth = require('../../passport/jwt');
const error = require('../../lib/error');
const Response = require('../../response');

const passport = iPassport;

const validate = (err, req, res, next) => {
    if (err)
        return res.status(err.head.code).json(err);
    if (!req.user){
        let err = new error.UnauthorizedClientError('user_not_authenticated');
        return res.status(err.head.code).json(err);
    }
    req.auth = { id : req.user.id };
    next();
};

const postAuth = (req, res, next) => {
    Response.ResponseReply(res, 200, xConfig.debugMode ? { 'token' : req.token } : {});
};

/*************************************************Local Login**********************************************************/
router.post('/local', passport.authenticate('local-login', {
    failureFlash : true,
    session : false
}), validate, auth.generateApiToken, postAuth);


/*************************************************Local Signup*********************************************************/
router.post('/signup', passport.authenticate('local-signup', {
    failureFlash : true,
    session : false
}), validate, auth.generateApiToken, postAuth);

module.exports = router;