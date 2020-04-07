const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = require('./UserSchema');
const CompanySchema = require('./CompanySchema');

export default new Schema({
    seller: {
        type: UserSchema,
        required: true
    },
    purchaser: {
        type: UserSchema,
        required: true
    },
    company: {
        type: CompanySchema,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    }
});
