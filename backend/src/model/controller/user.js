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
            .catch((err) => console.log(err))
            .then(() => next());
    }
    else return next();
});

UserSchema.methods.comparePassword = (password) => {
    return bCrypt.compare(this.local.password, password);
};

UserSchema.statics.getUser = (emailOrHandle, password) => {
    return UserModel
        .findOne({ $or : [ { email : emailOrHandle }, { handle : emailOrHandle } ] })
        .then((user) => {
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
    let tags = [ "handle", "email", "password" ], opts = {};
    for (let tag of tags) {
        if (!(tag in fields))
            throw new error.InvalidRequestError('missing_parameter', `${tag}`);
        opts[ tag ] = fields[ tag ].trim();
    }
    
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
    
    if (!validator.isEmail(opts.password))
        throw new error.InvalidRequestError('invalid_parameter', 'email');
    
    return Promise.all([ UserSchema.handleExists(opts.handle), UserSchema.emailExists(opts.email) ])
        .spread((handleExists, emailExist) => {
            if (handleExists) throw new error.InvalidRequestError("user_exists", 'handle');
            if (emailExist) throw new error.InvalidRequestError("user_exists", 'email');
            
            return UserModel.create(opts)
                .catch((e) => {
                    throw new error.ServerError(e);
                });
        });
};

module.exports = UserModel = mongoose.model('User', UserSchema);