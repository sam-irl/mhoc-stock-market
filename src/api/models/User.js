import mongoose from 'mongoose';
import UserSchema from '../schemas/UserSchema';

export default mongoose.model('User', UserSchema);
