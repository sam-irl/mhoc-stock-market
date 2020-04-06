const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = require('./UserSchema');
const ShareSchema = require('./ShareSchema');

export default new Schema({
    ticker: {
        type: String,
        required: true,
        uppercase: true
    },
    name: {
        type: String,
        required: true
    },
    primary: {
        type: UserSchema,
        required: true
    },
    directors: [UserSchema],
    shares: [ShareSchema],
    id: {
        type: String,
        required: true
    },
    sic: [String],
    status: {
        type: String,
        enum: ['Active', 'Inactive'] // todo ask nub what the statuses are
    }
});
