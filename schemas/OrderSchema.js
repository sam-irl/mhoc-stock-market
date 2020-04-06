const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = require('./UserSchema');
const CompanySchema = require('./CompanySchema');

export default new Schema({
    user: {
        type: UserSchema,
        required: true
    },
    orderType: {
        type: String,
        enum: ['buy', 'sell'],
        required: true
    },
    company: {
        type: CompanySchema,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    expires: {
        type: Date,
        required: true
    }
});
