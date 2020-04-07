const Share = require('../models/Share');

/**
 * The ShareController, where shares are created and split.
 *
 * @class ShareController
 */
class ShareController {
    /**
     * Creates a new share in the given company.
     *
     * @for ShareController
     * @method createNewShare
     * @param {Company} company 
     * @param {User} owner 
     * @returns {Promise<Share>}
     * @async
     */
    async createNewShare(company, owner) {
        return Share.create({ company: company, owner: owner });
    }

    /**
     * Creates `amount` shares in `company`.
     *
     * @for ShareController
     * @method createNewShares
     * @param {Company} company 
     * @param {User} owner
     * @param {Number} amount  
     * @returns {Promise<Share[]>}
     * @async
     */
    async createNewShares(company, owner, amount) {
        const createdShares = [];
        for (let i = 0; i < amount; i++) {
            const createdShare = await this.createNewShare(company, owner);
            createdShares.push(createdShare);
        }
        return createdShares;
    }

    /**
     * Returns `amount` of the shares of a given `company`.
     * If `amount` is not specified, returns all of the shares.
     *
     * @for ShareController
     * @method findCompanyShares
     * @param {Company} company 
     * @param {Number} amount
     * @returns {Promise<Share[]>}
     * @async
     */
    async findCompanyShares(company, amount = 0) {
        if (amount = 0) {
            return Share.find({ company: company });
        }
        return Share.find({ company: company }).limit(amount);
    }

    /**
     * Returns `amount` of the shares that `user` owns.
     * If `amount` is not specified, returns all of the shares.
     *
     * @for ShareController
     * @method findUserShares
     * @param {User} user
     * @param {Number} amount
     * @returns {Promise<Share[]>}
     * @async
     */
    async findUserShares(user, amount = 0) {
        if (amount = 0) {
            return Share.find({ owner: user });
        }
        return Share.find({ owner: user }).limit(amount);
    }

    /**
     * Returns `amount` of the shares that `user` owns in `company`.
     * If `amount` is not specified, returns all of the shares.
     *
     * @for ShareController
     * @method findUserSharesInCompany
     * @param {User} user
     * @param {Company} company
     * @param {Number} amount
     * @returns {Promise<Share[]>}
     * @async
     */
    async findUserSharesInCompany(user, company, amount = 0) {
        if (amount = 0) {
            return Share.find({ owner: user, company: company });
        }
        return Share.find({ owner: user, company: company }).limit(amount);
    }
}

export default new ShareController();
