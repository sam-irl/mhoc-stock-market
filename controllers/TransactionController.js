const Transaction = require('../models/Transaction');

const UserController = require('./UserController');

/**
 * The TransactionController. Currently just provides the
 * framework for the execution of a new transaction.
 *
 * @class TransactionController
 */
class TransactionController {
    /**
     * Creates a new transaction. Will throw if there's not enough
     * shares to be transacted.
     *
     * @for TransactionController
     * @method createTransaction
     * @param {User} seller 
     * @param {User} purchaser 
     * @param {Company} company 
     * @param {Number} quantity 
     * @param {Number} price 
     * @returns {Promise<Transaction>}
     * @async
     */
    async createTransaction(seller, purchaser, company, quantity, price) {
        const shares = UserController.getShares(seller, quantity, company);
        const purchaserMoney = await UserController.money(purchaser);
        if (price * quantity * 1.05 > purchaserMoney) {
            throw Error(`${purchaser.name} does not have enough money to purchase ${quantity} shares in ${company.ticker}!`);
        }
        if (shares.length !== quantity) {
            throw Error(`${seller.name} does not have enough shares in ${company.ticker} to sell!`);
        }
        const transaction = new Transaction({
            seller: seller,
            purchaser: purchaser,
            company: company,
            quantity: quantity,
            price: price,
            timestamp: new Date()
        });
        await transaction.save();
        await UserController.pay(purchaser, seller, quantity, `${quantity} ${company.ticker} @ ${price}: ${seller.name} -> ${purchaser.name}`);
        await UserController.removeShares(seller, shares);
        await UserController.addShares(purchaser, shares);
        await UserController.addTransaction(seller, transaction);
        await UserController.addTransaction(purchaser, transaction);
        return transaction;
    }
}

export default new TransactionController();
