const User = require('../models/User');
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
     * @returns Promise<Boolean>
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
     * @returns Promise<User>
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
     * @returns Promise<User>
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
     * Will reject if the user doesn't exist.
     *
     * @for UserController
     * @method addShares
     * @param {String} name 
     * @param {Share[]} shares
     * @returns Promise
     * @async 
     */
    async addShares(name, shares) {
        const user = await User.findOne({ name: name });
        user.shares.push(...shares);
        return user.save();
    }

    /**
     * Removes the array of `Share`s from the user's share array.
     * If the user does not own a given `Share`, it won't be removed from
     * their array. Will reject if the user doesn't exist.
     *
     * @for UserController
     * @method removeShares
     * @param {String} name 
     * @param {Share[]} shares
     * @returns Promise
     * @async 
     */
    async removeShares(name, shares) {
        const user = await User.findOne({ name: name });
        shares.forEach(shareToRemove => {
            user.shares = user.shares.filter(share => {
                return share._id !== shareToRemove._id;
            });
        });
        return user.save();
    }

    /**
     * Adds a new `Transaction` to the user's transaction array.
     * Will reject if the user doesn't exist.
     *
     * @for UserController
     * @method addTransaction
     * @param {String} name 
     * @param {Transaction} transaction
     * @returns Promise
     * @async 
     */
    async addTransaction(name, transaction) {
        const user = await User.findOne({ name: name });
        user.transactions.push(transaction);
        return user.save();
    }
}

export default new UserController();
