const Order = require('../models/Order');
const TransactionController = require('./TransactionController');

/**
 * The OrderController, where orders are made, queried, and filled.
 *
 * @class OrderController
 */
class OrderController {
    /**
     * Creates a new Order.
     *
     * @for OrderController
     * @method createOrder
     * @param {User} user 
     * @param {String} type 
     * @param {Company} company 
     * @param {Number} price 
     * @param {Number} quantity 
     * @param {Number} tolerance 
     * @param {Date} expires 
     * @returns {Promise<Order>}
     * @async
     */
    async createOrder(user, type, company, price, quantity, tolerance, expires) {
        return Order.create({
            user: user,
            type: type,
            company: company,
            price: price,
            quantity: quantity,
            tolerance: tolerance,
            expires: expires
        });
    }

    /**
     * Gets all the orders for `company`.
     *
     * @for OrderController
     * @method getOrdersInCompany
     * @param {Company} company 
     * @returns {Promise<Order[]>}
     * @async
     */
    async getOrdersInCompany(company) {
        return Order.find({ company: company });
    }

    /**
     * Gets all of the orders in `company` of the designated `type`.
     *
     * @for OrderController
     * @method getOrdersInCompanyByType
     * @param {Company} company 
     * @param {String} type 
     * @returns {Promise<Order[]>}
     * @async
     */
    async getOrdersInCompanyByType(company, type) {
        return Order.find({ company: company, type: type });
    }

    /**
     * Gets all the orders in `company` of the opposing type of `type`.
     *
     * @for OrderController
     * @method getComplementOrdersInCompany
     * @param {Company} company 
     * @param {String} type 
     * @returns {Promise<Order[]>}
     * @async
     */
    async getComplementOrdersInCompany(company, type) {
        if (type === 'buy') {
            return Order.find({ company: company, type: 'sell' });
        } else if (type === 'sell') {
            return Order.find({ company: company, type: 'buy' });
        } else {
            throw Error('invalid order type to get complement orders');
        }
    }

    /**
     * Fills all or part of a `buyOrder` and `sellOrder`.
     *
     * @for OrderController
     * @method fulfillOrders
     * @param {Order} buyOrder 
     * @param {Order} sellOrder 
     * @returns {Promise<void>}
     * @async
     */
    async fulfillOrders(buyOrder, sellOrder) {
        const agreedPrice = buyOrder + (buyOrder - sellOrder) / 2;
        const maxShares = Math.max(buyOrder.quantity, sellOrder.quantity);
        await TransactionController.createTransaction(
            sellOrder.user,
            buyOrder.user,
            buyOrder.company,
            maxShares,
            agreedPrice
        );
        if (buyOrder.quantity > sellOrder.quantity) {
            buyOrder.quantity = buyOrder.quantity - sellOrder.quantity;
            await buyOrder.save();
            await sellOrder.deleteOne();
        } else if (buyOrder.quantity < sellOrder.quantity) {
            sellOrder.quantity = sellOrder.quantity - buyOrder.quantity;
            await sellOrder.save();
            await buyOrder.deleteOne();
        } else {
            await sellOrder.deleteOne();
            await buyOrder.deleteOne();
        }
    }
}

export default new OrderController();
