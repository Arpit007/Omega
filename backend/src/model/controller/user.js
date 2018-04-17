/**
 * Created by StarkX on 08-Mar-18.
 */
const mongoose = require('mongoose');
const bCrypt = require('bcrypt');
const Promise = require('bluebird');
const validator = require('validator');

const error = require('../../lib/error');
const UserSchema = require('../schema/userSchema');

UserSchema.pre('save', function (next) {
    let user = this;
    if (user.isModified('password') || this.isNew) {
        return bCrypt.genSalt(8)
            .then((salt) => bCrypt.hash(user.password, salt))
            .then((hash) => {
                user.password = hash
            })
            .catch(console.log)
            .then(() => next());
    }
    else return next();
});

UserSchema.methods.comparePassword = function (password) {
    return bCrypt.compare(password, this.password);
};

UserSchema.statics.getUser = (emailOrHandle, password) => {
    return UserModel
        .findOne({ $or : [ { email : emailOrHandle }, { handle : emailOrHandle } ] })
        .then((user) => {
            if (!user) return;
            return user.comparePassword(password)
                .then((isValid) => {
                    if (isValid) return user;
                });
        });
};

UserSchema.statics.handleExists = (handle) => {
    return UserModel.find({ handle : handle })
        .then((users) => {
            return users.length > 0;
        });
};

UserSchema.statics.emailExists = (email) => {
    return UserModel.find({ email : email })
        .then((users) => {
            return users.length > 0;
        });
};

UserSchema.statics.register = (fields) => {
    let opts = {};
    
    if (!fields)
        throw new error.InvalidRequestError('missing_parameter', 'all');
    if (!fields.handle)
        throw new error.InvalidRequestError('missing_parameter', 'handle');
    else opts.handle = fields.handle.trim();
    if (!fields.email)
        throw new error.InvalidRequestError('missing_parameter', 'email');
    else opts.email = fields.email.trim();
    if (!fields.password)
        throw new error.InvalidRequestError('missing_parameter', 'password');
    else opts.password = fields.password;
    if (!validator.isAscii(opts.handle) || validator.isEmail(opts.handle))
        throw new error.InvalidRequestError('invalid_parameter', 'handle');
    if (opts.handle.length < 3)
        throw new error.InvalidRequestError('short_param', 'handle');
    if (opts.handle.length > 10)
        throw new error.InvalidRequestError('long_param', 'handle');
    
    if (!validator.isAscii(opts.password))
        throw new error.InvalidRequestError('invalid_parameter', 'password');
    if (opts.password.length < 8)
        throw new error.InvalidRequestError('short_param', 'password');
    if (opts.password.length > 16)
        throw new error.InvalidRequestError('long_param', 'password');
    
    if (!validator.isEmail(opts.email))
        throw new error.InvalidRequestError('invalid_parameter', 'email');
    
    return Promise.all([ UserModel.handleExists(opts.handle), UserModel.emailExists(opts.email) ])
        .spread((handleExists, emailExist) => {
            if (handleExists) throw new error.InvalidRequestError("user_exists", 'handle');
            if (emailExist) throw new error.InvalidRequestError("user_exists", 'email');
            
            return UserModel.create(opts)
                .catch((e) => {
                    throw new error.ServerError(e);
                });
        });
};

UserSchema.statics.getUserById = (userId) => {
    return UserModel.findOne({ _id : userId });
};

module.exports = UserModel = mongoose.model('User', UserSchema);