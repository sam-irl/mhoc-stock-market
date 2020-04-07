import UserController from './UserController';
import Transaction from '../models/Transaction';

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
        const shares = await UserController.getShares(seller, company, quantity);
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
        for (let i = 0; i < shares.length; i++) {
            shares[i].owner = purchaser;
            await shares[i].save();
        }
        await UserController.addTransaction(seller, transaction);
        await UserController.addTransaction(purchaser, transaction);
        return transaction;
    }

    /**
     * Finds all of `user`'s transactions.
     *
     * @for TransactionController
     * @method getUserTransactions
     * @param {User} user 
     * @returns {Promise<Transaction[]>}
     * @async
     */
    async getUserTransactions(user) {
        return this.findTransactions({ user: user.name });
    }

    /**
     * Finds `Transaction`s subject to the given `filter`.
     * In effect, the same as `Transaction.find()`.
     *
     * @for TransactionController
     * @method findTransactions
     * @param {Object} filter 
     * @returns {Promise<Transaction[]>}
     * @async
     */
    async findTransactions(filter = {}) {
        return Transaction.find(filter);
    }
}

export default new TransactionController();
