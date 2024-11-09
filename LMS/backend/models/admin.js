// models/admin.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    name: { type: String, required: true },
    password: { type: String, required: true},
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Admin', AdminSchema);
