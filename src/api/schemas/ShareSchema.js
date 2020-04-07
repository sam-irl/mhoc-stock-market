import mongoose from 'mongoose';
import CompanySchema from './CompanySchema';
import UserSchema from './UserSchema';

const Schema = mongoose.Schema;

export default new Schema({
    owner: {
        type: UserSchema,
        required: true
    },
    company: {
        type: CompanySchema,
        required: true
    }
});
