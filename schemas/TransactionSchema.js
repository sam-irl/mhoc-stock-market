const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = require('./UserSchema');
const ShareSchema = require('./ShareSchema');

export default new Schema({
    seller: {
        type: UserSchema,
        required: true
    },
    purchaser: {
        type: UserSchema,
        required: true
    },
    shares: {
        type: [ShareSchema],
        required: true
    }
});
