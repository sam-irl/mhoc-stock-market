import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export default new Schema({
    name: {
        type: String,
        required: true
    },
    accountID: {
        type: String,
        required: true
    }
});
