import mongoose from 'mongoose';
import ShareSchema from '../schemas/ShareSchema';

export default mongoose.model('Share', ShareSchema);
