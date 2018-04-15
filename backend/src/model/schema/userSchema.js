/**
 * Created by StarkX on 08-Mar-18.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

let mongooseHidden = require('mongoose-hidden')();

const UserSchema = new Schema({
    handle : { type : String, trim : true, required : true, unique: true },
    email : { type : String, trim : true, required : true, unique : true},
    password : { type : String, required : true, hideJSON : true }
});

UserSchema.plugin(mongooseHidden);

module.exports = UserSchema;