import mongoose from 'mongoose';
import CompanySchema from './CompanySchema';
import UserSchema from './UserSchema';

const Schema = mongoose.Schema;

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
