export default class CompanyModel {
    constructor(options) {
        /**
         * The name of the company, as registered with Model Companies House.
         *
         * @for CompanyModel
         * @prop _name
         * @type String
         * @private
         */
        this._name = options.name;

        /**
         * The owner or principal administrator of the company.
         *
         * @for CompanyModel
         * @prop _owner
         * @type String
         * @private
         */
        this._owner = options.owner;

        /**
         * The list of Shareholders in the company.
         *
         * @for CompanyModel
         * @prop _shareholders
         * @type Shareholder[]
         * @private
         */
        this._shareholders = options.shareholders;

        /**
         * The company's assets.
         *
         * @for CompanyModel
         * @prop _assets
         * @type Object
         * @private
         */
        this._assets = options.assets;
        // TODO: this should probably interface with the NubBank API
    }
}