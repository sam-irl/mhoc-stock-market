const mongoose = require('mongoose');
const CompanySchema = require('../schemas/CompanySchema');

export default mongoose.model('Company', CompanySchema);
