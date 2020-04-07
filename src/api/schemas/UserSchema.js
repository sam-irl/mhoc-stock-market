import mongoose from 'mongoose';
import OrderSchema from './OrderSchema';
import TransactionSchema from './TransactionSchema';

const Schema = mongoose.Schema;

export default new Schema({
    name: {
        type: String,
        required: true
    },
    accountID: {
        type: String,
        required: true
    },
    transactions: [TransactionSchema]
});
