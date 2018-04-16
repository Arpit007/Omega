/**
 * Created by StarkX on 16-Apr-18.
 */
const mongoose = require('mongoose');
const Promise = require('bluebird');

const error = require('../../lib/error');
const FileSchema = require('../schema/fileSchema');

FileSchema.statics.getFileById = (Id) => {
    return FileModel.findOne({ _id : Id });
};

module.exports = FileModel = mongoose.model('File', FileSchema);