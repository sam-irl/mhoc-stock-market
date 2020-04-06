const mongoose = require('mongoose');
const OrderSchema = require('../schemas/OrderSchema');

export default mongoose.model('Order', OrderSchema);
