const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const MemberSchema = new Schema({
    member_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: { 
        type: String, 
        required: true, 
        unique: true 
    },
    phone_number: {
        type: String,
        validate: {
            validator: function(v) {
                // Regex to ensure the phone number starts with 6789 and has 10 digits
                return /^6789\d{6}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number! It must start with 6789 and have exactly 10 digits.`
        },
        required: false // Optional if phone number is not mandatory
    },
    address: {
        type: String
    },
    role: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Role', 
        required: true
    }
});

MemberSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Member', MemberSchema);
