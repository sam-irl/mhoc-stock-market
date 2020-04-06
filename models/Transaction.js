const mongoose = require('mongoose');
const TransactionSchema = require('../schemas/TransactionSchema');

export default mongoose.model('Transaction', TransactionSchema);
