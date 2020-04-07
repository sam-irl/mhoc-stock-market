import mongoose from 'mongoose';
import TransactionSchema from '../schemas/TransactionSchema';

export default mongoose.model('Transaction', TransactionSchema);
