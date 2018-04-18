/**
 * Created by Home Laptop on 16-Apr-18.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

let mongooseHidden = require('mongoose-hidden')();

const deviceSchema = new Schema({
    name : String,
    userId : { type : ObjectId, ref : 'User', required : true, hideJSON : true },
    accessToken : { type : String, unique : true, hideJSON : true },
    download : [ { type : ObjectId, ref : 'Download' } ],
    pin : [ { type : ObjectId, ref : 'File' } ],
    lastActive : { type : Date, default : new Date() }
});

deviceSchema.plugin(mongooseHidden);

module.exports = deviceSchema;