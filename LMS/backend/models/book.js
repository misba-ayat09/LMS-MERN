const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    book_name: {type: String, required:true},
    author: {
        type: String,
        required: true
    },
    genre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    publication: {
        type: String,
        required: true
    }
},{timestamps:true})

module.exports = mongoose.model('Book',BookSchema)