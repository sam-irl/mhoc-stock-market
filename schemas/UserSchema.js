const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShareSchema = require('./ShareSchema');
const TransactionSchema = require('./TransactionSchema');

export default new Schema({
    name: {
        type: String,
        required: true
    },
    accountID: {
        type: String,
        required: true
    },
    shares: [ShareSchema],
    transactions: [TransactionSchema]
});
