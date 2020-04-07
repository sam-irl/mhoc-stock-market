import Company from '../models/Company';
import ShareController from './ShareController';
import UserController from './UserController';

/**
 * The CompanyController, where the app interfaces with companies
 * from the database.
 *
 * @class CompanyController
 */
class CompanyController {
    /**
     * Finds a company given its name. Must be an exact match to
     * the name stored in the database, not a nearest-value lookup.
     *
     * @for CompanyController
     * @method findCompanyByName
     * @param {String} name
     * @returns {Promise<Company>}
     * @async
     */
    async findCompanyByName(name) {
        return Company.findOne({ name: name });
    }

    /**
     * Finds a company by its LSE ticker. All tickers are stored
     * upper-case in the database, and this method will convert
     * the given `ticker` to uppercase if it isn't passed that way.
     *
     * @for CompanyController
     * @method findCompanyByTicker
     * @param {String} ticker 
     * @returns {Promise<Company>}
     * @async
     */
    async findCompanyByTicker(ticker) {
        return Company.findOne({ ticker: ticker.toUpperCase() });
    }

    /**
     * Returns an array of companies that the given `User` directs.
     * **This function accepts a User, not a String, as a parameter.**
     *
     * @for CompanyController
     * @method findCompaniesUserDirects
     * @param {User} user 
     * @returns {Promise<Company[]>}
     * @async
     */
    async findCompaniesUserDirects(user) {
        return Company
            .find({})
            .where('directors')
            .elemMatch({ name: user.name });
    }

    /**
     * Creates a new company and stores it in the database. Assigns initial
     * class-A shares based on `shareDistribution`, which should be a
     * key-value object, where the keys are usernames and the values are
     * the number of shares the user should be issued.
     * 
     * Returns the `Promise` for the saving of the new company to the
     * database to allow for error handling.
     *
     * @for CompanyController
     * @method createNewCompany
     * @param {String} name 
     * @param {String} ticker 
     * @param {User} primary 
     * @param {User[]} directors 
     * @param {Object} shareDistribution 
     * @returns {Promise<void>}
     * @async
     */
    async createNewCompany(name, ticker, primary, directors, shareDistribution) {
        const company = new Company({
            name: name,
            ticker: ticker.toUpperCase(),
            primary: primary,
            directors: directors
        });
        await company.save();
        const usersOwningShares = Object.keys(shareDistribution);
        for (let i = 0; i < usersOwningShares.length; i++) {
            const name = usersOwningShares[i];
            const user = await UserController.findUser(name);
            await ShareController.createNewShares(company, user, shareDistribution[name]);
        }
    }

    /**
     * Finds `amount` of companies. If `amount` isn't
     * specified, finds all of the companies. Filters
     * by `filter`.
     *
     * @for CompanyController
     * @method findCompanies
     * @param {Object} filter
     * @param {Number} amount
     * @returns {Promise<Company[]>}
     * @async
     */
    findCompanies(filter = {}, amount = false) {
        if (!amount) {
            return Company.find(filter);
        }
        return Company.find(filter).limit(amount);
    }
}

export default new CompanyController();
