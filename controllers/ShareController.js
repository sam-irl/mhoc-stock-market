const Share = require('../models/Share');

/**
 * The ShareController, where shares are created and split.
 *
 * @class ShareController
 */
class ShareController {
    /**
     * Creates a new share in the given company, optionally
     * the share class is specified.
     *
     * @for ShareController
     * @method createNewShare
     * @param {Company} company 
     * @param {String} shareClass 
     * @returns Promise<Share>
     * @async
     */
    async createNewShare(company, shareClass = 'A') {
        return Share.create({
            company: company,
            shareClass: shareClass
        });
    }

    /**
     * Creates `amount` shares in `company`. Optionally the share class
     * is given, defaulting to `'A'`.
     *
     * @for ShareController
     * @method createNewShares
     * @param {Company} company 
     * @param {Number} amount 
     * @param {String} shareClass 
     * @returns Promise<Share[]>
     * @async
     */
    async createNewShares(company, amount, shareClass = 'A') {
        const createdShares = [];
        for (let i = 0; i < amount; i++) {
            const createdShare = await this.createNewShare(company, shareClass);
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
     * @returns Promise<Share[]>
     * @async
     */
    async findCompanyShares(company) {
        return Share.find({ company: company });
    }

    /**
     * Returns all the class-`shareClass` shares of a given `company`.
     *
     * @for ShareController
     * @method findCompanySharesByClass
     * @param {Company} company 
     * @param {String} shareClass 
     * @returns Promise<Share[]>
     * @async
     */
    async findCompanySharesByClass(company, shareClass) {
        return Share.find({ company: company, shareClass: shareClass });
    }

    /**
     * Splits a share into two shares of the lower class.
     * If attempting to split a class-C share, will return false.
     *
     * @for ShareController
     * @method splitShare
     * @param {Share} share 
     * @returns Promise<Share[]|Boolean>
     * @async
     */
    async splitShare(share) {
        if (share.shareClass === 'C') return false;
        const nextShareClass = share.shareClass === 'A' ? 'B' : 'C';
        const firstSplitShare = await this.createNewShare(share.company, nextShareClass);
        const secondSplitShare = await this.createNewShare(share.company, nextShareClass);
        share.deleteOne();
        return [firstSplitShare, secondSplitShare];
    }

    /**
     * Splits an array of `Share`s into shares of the lower class.
     * If a class-C share is included, will simply put it in the result
     * array unmodified.
     *
     * @for ShareController
     * @method splitShares
     * @param {Share[]} shares 
     * @returns Promise<Share[]>
     */
    async splitShares(shares) {
        const splitShares = [];
        shares.forEach(share => {
            const createdShares = await splitShare(share);
            if (createdShares) splitShares.push(...createdShares);
            else splitShares.push(share);
        });
        return splitShares;
    }
}

export default new ShareController();
