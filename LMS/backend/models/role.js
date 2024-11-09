const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const RoleSchema = new Schema({
    role: {type: String, enum:['member','admin'], required:true}
})
RoleSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Role', RoleSchema)