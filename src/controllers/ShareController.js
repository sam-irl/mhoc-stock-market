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
     * @returns {Promise<Share>}
     * @async
     */
    async createNewShare(company) {
        return Share.create({ company: company });
    }

    /**
     * Creates `amount` shares in `company`.
     *
     * @for ShareController
     * @method createNewShares
     * @param {Company} company 
     * @param {Number} amount  
     * @returns {Promise<Share[]>}
     * @async
     */
    async createNewShares(company, amount) {
        const createdShares = [];
        for (let i = 0; i < amount; i++) {
            const createdShare = await this.createNewShare(company);
            createdShares.push(createdShare);
        }
        return createdShares;
    }

    /**
     * Returns all the shares of a given `company`.
     *
     * @for ShareController
     * @method findCompanyShares
     * @param {Company} company 
     * @returns {Promise<Share[]>}
     * @async
     */
    async findCompanyShares(company) {
        return Share.find({ company: company });
    }
}

export default new ShareController();
