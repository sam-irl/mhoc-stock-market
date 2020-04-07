import mongoose from 'mongoose';
import OrderSchema from '../schemas/OrderSchema';

export default mongoose.model('Order', OrderSchema);
