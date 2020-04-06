const mongoose = require('mongoose');
const ShareSchema = require('../schemas/ShareSchema');

export default mongoose.model('Share', ShareSchema);
