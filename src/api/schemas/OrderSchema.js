import mongoose from 'mongoose';
import CompanySchema from './CompanySchema';
import User from '../models/User';

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
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

OrderSchema.pre('deleteOne', { document: true, query: false }, async function () {
    const owner = await User.find({})
        .where('orders')
        .elemMatch({ _id: this._id })[0];
    owner.orders = owner.orders.filter(order => order._id !== this._id);
    return owner.save();
});

export default OrderSchema;
