import express from 'express';
import CompanyController from '../controllers/CompanyController';
import {
    isAuthenticated,
    isAllowed
} from '../middleware/middleware';
import UserController from '../controllers/UserController';
import ShareController from '../controllers/ShareController';

const router = express.Router();

router.post('/', isAuthenticated, (req, res) => {
    if (req.body.user && req.body.company) {
        const companyPromise = CompanyController.findCompanyByTicker(req.body.company);
        const userPromise = UserController.findUser(req.body.user);
        Promise.all([companyPromise, userPromise])
            .then(resolutions => {
                const company = resolutions[0];
                const user = resolutions[1];
                ShareController.findUserSharesInCompany(user, company)
                    .then(shares => {
                        res.status(200).json(shares)
                    })
                    .catch(err => {
                        console.error(err);
                        res.status(500).json(err);
                    });
            })
            .catch(err => {
                console.error(err);
                res.status(500).json(err);
            });
    } else if (req.body.user) {
        UserController.findUser(req.body.user)
            .then(user => {
                ShareController.findUserShares(user)
                    .then(shares => {
                        res.status(200).json(shares);
                    })
                    .catch(err => {
                        console.error(err);
                        res.status(500).json(err);
                    });
            })
            .catch(err => {
                console.error(err);
                res.status(500).json(err);
            });
    } else if (req.body.company) {
        CompanyController.findCompanyByTicker(req.body.company)
            .then(company => {
                ShareController.findCompanyShares(company)
                    .then(shares => {
                        res.status(200).json(shares);
                    })
                    .catch(err => {
                        console.error(err);
                        res.status(500).json(err);
                    });
            })
            .catch(err => {
                console.error(err);
                res.status(500).json(err);
            });
    } else {
        res.status(400).json({ err: { status: 400, message: 'missing one of user or company' } });
    }
});

export default router;
