const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompanySchema = require('./CompanySchema');
const Company = require('../models/Company');
const User = require('../models/User');

const ShareSchema = new Schema({
    company: {
        type: CompanySchema,
        required: true
    }
});

ShareSchema.pre('deleteOne', { document: true, query: false}, async function () {
    const owner = await User.find({})
        .where('shares')
        .elemMatch({ _id: this._id })[0];
    const company = await Company.find({})
        .where('shares')
        .elemMatch({ _id: this._id })[0];
    owner.shares = owner.shares.filter(share => share._id !== this._id);
    company.shares = company.shares.filter(share => share._id !== this._id);
    await owner.save();
    await company.save();
});

export default ShareSchema;
