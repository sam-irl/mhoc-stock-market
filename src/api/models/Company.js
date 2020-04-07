import mongoose from 'mongoose';
import CompanySchema from '../schemas/CompanySchema';

export default mongoose.model('Company', CompanySchema);
