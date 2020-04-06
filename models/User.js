const mongoose = require('mongoose');
const UserSchema = require('../schemas/UserSchema');

export default mongoose.model('User', UserSchema);
