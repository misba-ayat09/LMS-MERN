const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RentalSchema = new Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
        required: true
    },
    rental_date: {
        type: Date,
        default: Date.now
    },
    due_date: {
        type: Date,
        required: true
    },
    return_date: {
        type: Date
    },
    fine: {
        type: Number,
        default: 0
    }
},{timestamps:true});

module.exports = mongoose.model('Rent', RentalSchema);