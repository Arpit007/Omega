/**
 * Created by StarkX on 16-Apr-18.
 */
const mongoose = require('mongoose');
const Promise = require('bluebird');

const error = require('../../lib/error');
const DownloadSchema = require('../schema/downloadSchema');

DownloadSchema.statics.getDownloadById = (Id) => {
    return DownloadModel.findOne({ _id : Id });
};

module.exports = DownloadModel = mongoose.model('Download', DownloadSchema);