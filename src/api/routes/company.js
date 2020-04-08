import express from 'express';
import CompanyController from '../controllers/CompanyController';
import UserController from '../controllers/UserController';
import {
    isAuthenticated,
    isAdmin
} from '../middleware/middleware';

const router = express.Router();

router.post('/', isAuthenticated, (req, res) => {
    CompanyController.findCompanies(req.body.params || {})
        .then(companies => {
            res.status(200).json(companies);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json(err);
        });
});

router.post('/name', isAuthenticated, (req, res) => {
    if (!req.body.name) return res.status(400).json({ err: { status: 400, message: 'did not receive any name' } });
    const name = req.body.name;
    CompanyController.findCompanyByName(name)
        .then(company => {
            res.status(200).json(company);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json(err);
        });
});

router.post('/ticker', isAuthenticated, (req, res) => {
    if (!req.body.ticker) return res.status(400).json({ err: { status: 400, message: 'did not receive any ticker' } });
    const ticker = req.body.ticker;
    CompanyController.findCompanyByTicker(ticker)
        .then(company => {
            res.status(200).json(company);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json(err);
        });
});

router.post('/director', isAuthenticated, (req, res) => {
    if (!req.body.user) return res.status(400).json({ err: { status: 400, message: 'did not receive any user' } });
    const username = req.body.user;
    CompanyController.findCompaniesUserDirects(username)
        .then(companies => {
            res.status(200).json(companies);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json(err);
        });
});

router.post('/create', isAuthenticated, isAdmin, (req, res) => {
    if (!(
        req.body.hasOwnProperty('primary') &&
        req.body.hasOwnProperty('directors') &&
        req.body.hasOwnProperty('name') &&
        req.body.hasOwnProperty('ticker') &&
        req.body.hasOwnProperty('shareDistribution')
    )) {
        return res.status(422).json({ err: { status: 422, message: 'request body did not contain all requisite keys' } });
    }

    const primaryUserPromise = UserController.findUser(req.body.primary);
    const directorsPromises = [];
    req.body.directors.forEach(director => {
        directorsPromises.push(UserController.findUser(director));
    });
    Promise.all([primaryUserPromise, ...directorsPromises])
        .then(resolutions => {
            const primaryUser = resolutions[0];
            resolutions.splice(0, 1);
            const directors = resolutions;

            CompanyController.createNewCompany(
                req.body.name,
                req.body.ticker,
                primaryUser,
                directors,
                req.body.shareDistribution
            ).then(() => {
                res.status(200).json({ status: 'ok' });
            }).catch(err => {
                console.error(err);
                res.status(500).json(err);
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json(err);
        });
});

export default router;
