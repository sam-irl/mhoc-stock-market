const User = require('../models/User');
const OrderController = require('./OrderController');
const nubbank = require('../util/nubbank');

/**
 * The `UserController`, which coordinates all interactions with `User` models.
 *
 * @class UserController
 */
class UserController {
    /**
     * Checks to see if the database has a document with username
     * matching `name`.
     *
     * @for UserController
     * @method userExists
     * @param {String} name
     * @returns {Promise<Boolean>}
     * @async 
     */
    async userExists(name) {
        const user = await User.findOne({ name: name });
        if (user) return true;
        return false;
    }

    /**
     * Returns a document matching the user with the given `name`.
     *
     * @for UserController
     * @method findUser
     * @param {String} name
     * @returns {Promise<User>}
     * @async 
     */
    async findUser(name) {
        return User.findOne({ name: name });
    }

    /**
     * Creates a new `User` with the given username. Will reject if this user
     * does not have a NubBank account.
     *
     * @for UserController
     * @method createUser
     * @param {String} name
     * @returns {Promise<User>}
     * @async 
     */
    async createUser(name) {
        const hasNubBankAccount = await nubbank.userHasAccount(name);
        if (!hasNubBankAccount) {
            throw Error('user does not have nub bank account');
        }
        const accountID = await nubbank.getAccountID(name);
        return User.create({
            name: name,
            accountID: accountID
        });
    }

    /**
     * Adds the array of `Share`s provided to the user's share array.
     *
     * @for UserController
     * @method addShares
     * @param {User} user 
     * @param {Share[]} shares
     * @returns {Promise}
     * @async 
     */
    async addShares(user, shares) {
        user.shares.push(...shares);
        return user.save();
    }

    /**
     * Removes the array of `Share`s from the user's share array.
     * If the user does not own a given `Share`, it won't be removed from
     * their array.
     *
     * @for UserController
     * @method removeShares
     * @param {User} user 
     * @param {Share[]} shares
     * @returns {Promise}
     * @async 
     */
    async removeShares(user, shares) {
        shares.forEach(shareToRemove => {
            user.shares = user.shares.filter(share => {
                return share._id !== shareToRemove._id;
            });
        });
        return user.save();
    }

    /**
     * Gets `amount` of `user`'s `Share`s in `company`.
     *
     * @for UserController
     * @method getShares
     * @param {User} user 
     * @param {Number} amount
     * @param {Company} company
     * @returns {Share[]}
     */
    getShares(user, amount, company) {
        const resultArray = [];
        const shares = user.shares.filter(share => share.company._id === company._id);
        for (let i = 0; i < amount; i++) {
            if (shares[i]) {
                resultArray.push(shares[i]);
            }
        }
        return resultArray;
    }

    /**
     * Adds a new `Transaction` to the user's transaction array.
     *
     * @for UserController
     * @method addTransaction
     * @param {User} user
     * @param {Transaction} transaction
     * @returns {Promise}
     * @async 
     */
    async addTransaction(user, transaction) {
        user.transactions.push(transaction);
        return user.save();
    }

    /**
     * Returns the number of shares in `company` that `user` owns.
     *
     * @for UserController
     * @method sharesInCompany
     * @param {User} user
     * @param {Company} company
     * @returns {Number}
     */
    sharesInCompany(user, company) {
        const shares = user.shares.filter(share => share.company._id === company._id);
        return shares.length;
    }

    /**
     * Returns the number of shares that the user may place sell orders for,
     * by subtracting the number of shares the user has placed sell orders
     * for in the company from the number of shares the user owns.
     *
     * @for UserController
     * @method sellOrdersPlaceable
     * @param {User} user
     * @param {Company} company
     * @returns {Number}
     */
    sellOrdersPlaceable(user, company) {
        const sharesInCompany = this.sharesInCompany(user, company);
        const sellOrdersInCompany = user.orders.filter(order => {
            return order.company._id === company._id && order.orderType === 'sell';
        });
        return sharesInCompany - sellOrdersInCompany;
    }

    /**
     * Gets the amount of money the user has in their NubBank account.
     *
     * @for UserController
     * @method money
     * @param {User} user
     * @returns {Promise<Number>}
     * @async
     */
    async money(user) {
        const accountID = user.accountID;
        return nubbank.getMoney(accountID);
    }

    /**
     * The amount of 'cash on hand' the user has; the money in their
     * NubBank account minus the maximum potential cost of their buy orders.
     *
     * @for UserController
     * @method case
     * @param {User} user
     * @returns {Promise<Number>} 
     * @async
     */
    async cash(user) {
        const money = await money(user);
        const orders = user.orders.filter(order => order.type === 'buy');
        const buyOrderMaxCost = 0;
        orders.forEach(order => {
            buyOrderMaxCost += (order.price + order.tolerance) * order.quantity;
        });
        // account for 5% tx fee
        buyOrderMaxCost *= 1.05;
        return money - buyOrderMaxCost;
    }

    /**
     * Pays another user.
     *
     * @for UserController
     * @method pay
     * @param {User} user
     * @param {User} recipient
     * @param {Number} amount
     * @param {String} message
     * @returns {Promise<Boolean>}
     * @async
     */
    async pay(user, recipient, amount, message = amount + ' to ' + recipient + ' (lilyTrade)') {
        const fromAccountID = user.accountID;
        const toAccountID = recipient.accountID;
        return nubbank.makePayment(fromAccountID, toAccountID, amount, message);
    }

    /**
     * Places a new buy order with the given parameters.
     * Returns false if the user may not have enough money
     * to complete the order.
     *
     * @for UserController
     * @method placeBuyOrder
     * @param {User} user 
     * @param {Company} company 
     * @param {Number} amount 
     * @param {Number} price 
     * @param {Number} tolerance 
     * @param {Date} expires
     * @returns {Promise<Order|false>}
     * @async
     */
    async placeBuyOrder(user, company, amount, price, tolerance, expires) {
        const cash = await cash(user);
        const maxSharePrice = (price + tolerance) * amount;
        if (maxSharePrice * 1.05 > cash) return false;
        return OrderController.createOrder(
            user,
            'buy',
            company,
            price,
            amount,
            tolerance,
            expires
        );
    }

    /**
     * Places a new sell order. Returns false if the user does
     * not have enough shares to sell.
     *
     * @for UserController
     * @method placeSellOrder
     * @param {User} user 
     * @param {Company} company 
     * @param {Number} amount 
     * @param {Number} price 
     * @param {Number} tolerance 
     * @param {Date} expires 
     * @returns {Promise<Order|false>}
     * @async
     */
    async placeSellOrder(user, company, amount, price, tolerance, expires) {
        const maxAmount = this.sellOrdersPlaceable(user, company);
        if (maxAmount > amount) return false;
        return OrderController.createOrder(
            user,
            'sell',
            company,
            price,
            amount,
            tolerance,
            expires
        );
    }
}

export default new UserController();
