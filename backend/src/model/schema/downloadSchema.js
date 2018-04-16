/**
 * Created by Home Laptop on 16-Apr-18.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

let mongooseHidden = require('mongoose-hidden')();

let statusList = [ 'done', 'pending', 'canceled', 'unavailable' ];

const downloadSchema = new Schema({
    name : String,
    path : String,
    ext : String,
    status : { type : String, enum : statusList, default : 'pending' }
});

downloadSchema.plugin(mongooseHidden);

module.exports = downloadSchema;