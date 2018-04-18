/**
 * Created by StarkX on 16-Apr-18.
 */
const mongoose = require('mongoose');
const Promise = require('bluebird');

const error = require('../../lib/error');
const DeviceSchema = require('../schema/deviceSchema');

DeviceSchema.statics.getDeviceByUser = (userId) => {
    return DeviceModel.find({ userId : userId });
};

DeviceSchema.statics.getDeviceByToken = (accessToken) => {
    return DeviceModel.findOne({ accessToken : accessToken });
};

DeviceSchema.statics.getDeviceById = (deviceId) => {
    return DeviceModel.findOne({ _id : deviceId });
};

DeviceSchema.statics.login = (user, accessToken, name) => {
    return DeviceModel.create({
        userId : user._id,
        accessToken : accessToken,
        name : name
    });
};

DeviceSchema.methods.updateLastSeen = () => {
    let device = this;
    device.lastActive = new Date();
    return device.save();
};

module.exports = DeviceModel = mongoose.model('Device', DeviceSchema);