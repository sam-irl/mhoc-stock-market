import mongoose from 'mongoose';
import CompanySchema from './CompanySchema';
import UserSchema from './UserSchema';

const Schema = mongoose.Schema;

export default new Schema({
    user: {
        type: UserSchema,
        required: true
    },
    type: {
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
    quantity: {
        type: Number,
        required: true
    },
    tolerance: {
        type: Number,
        required: true
    },
    expires: {
        type: Date,
        required: true
    }
});
