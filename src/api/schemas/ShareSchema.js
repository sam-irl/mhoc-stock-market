const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompanySchema = require('./CompanySchema');
const UserSchema = require('./UserSchema');

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
