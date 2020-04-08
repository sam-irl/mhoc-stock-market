import request from 'request';
// Provides interfaces to interact with the NubBank API.
// Should be the only way the app interacts with the NubBank API.
// NubBank (c) 2020 Padanub, strideynet, ohprkl

// TODO: wait for stridey to do shit

const apiLocation = 'https://bank.nub.international/v1/';

// These are just boilerplate functions and will be implemented properly
// when the NubBank payments API is written.

/**
 * Checks whether or not the user has a NubBank account.
 * @param {String} username
 */
export const userHasAccount = async (username) => {
    return true;
};

export const getAccountID = async (username) => {
    return 'foo';
};

export const getMoney = async (accountID) => {
    return 100;
};

export const makePayment = async (fromAccountID, toAccountID, amount, message) => {
    return true;
};
