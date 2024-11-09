
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GenreSchema = new Schema({
    genre: { type: String, required: true }
}, { timestamps: true });

// Check if the Genre model already exists before defining it
module.exports = mongoose.models.Genre || mongoose.model('Genre', GenreSchema);
