const CompanyController = require('../controllers/CompanyController');
const OrderController = require('../controllers/OrderController');
const ShareController = require('../controllers/ShareController');
const TransactionController = require('../controllers/TransactionController');
const UserController = require('../controllers/UserController');

export default class MarketController {
    /**
     *
     * @constructor
     * @param {Function} errorHandler 
     */
    constructor(errorHandler) {
        /**
         * The function that should be the callback for any errors we encounter.
         *
         * @for MarketController
         * @prop _errorHandler
         * @type {Function}
         * @private
         */
        this._errorHandler = errorHandler;

        return this;
    }

    getPotentialTrades() {
        
    }
}