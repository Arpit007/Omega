/**
 * Created by Home Laptop on 16-Apr-18.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

let mongooseHidden = require('mongoose-hidden')();

const fileSchema = new Schema({
    name : String,
    path : String,
    ext : String,
    isReadable : Boolean,
    isWritable : Boolean,
    isFile : Boolean,
    isFolder : Boolean,
    isHidden : Boolean
});

fileSchema.plugin(mongooseHidden);

module.exports = fileSchema;