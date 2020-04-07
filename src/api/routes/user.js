import express from 'express';
import {
    isAuthenticated,
    isAllowed,
    isAdmin
} from '../middleware/middleware';
import UserController from '../controllers/UserController';
import CompanyController from '../controllers/CompanyController';

const router = express.Router();

router.post('/', isAuthenticated, isAllowed, (req, res) => {
    if (!req.body.user) return res.status(400).json({ err: { status: 400, message: 'did not provide a username' } });
    UserController.findUser(req.body.user)
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json(err);
        });
});

router.post('/exists', isAuthenticated, (req, res) => {
    if (!req.body.user) return res.status(400).json({ err: { status: 400, message: 'did not provide a username' } });
    UserController.userExists(req.body.user)
        .then(exists => {
            res.status(200).json(exists);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json(err);
        });
});

router.post('/create', isAuthenticated, isAdmin, (req, res) => {
    if (!req.body.user) return res.status(400).json({ err: { status: 400, message: 'did not provide a username' } });
    UserController.createUser(req.body.user)
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

router.post('/sellOrdersPlaceable', isAuthenticated, isAllowed, (req, res) => {
    if (!req.body.user || !req.body.company) return res.status(400).json({ err: { status: 400, message: 'did not provide a username and/or company ticker' } });
    const userPromise = UserController.findUser(req.body.user);
    const companyPromise = CompanyController.findCompanyByTicker(req.body.company);
    Promise.all([userPromise, companyPromise])
        .then(resolutions => {
            UserController.sellOrdersPlaceable(...resolutions)
                .then(result => {
                    res.status(200).json(result);
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
});

router.post('/money', isAuthenticated, isAllowed, (req, res) => {
    if (!req.body.user) return res.status(400).json({ err: { status: 400, message: 'did not provide a username' } });
    UserController.findUser(req.body.user)
        .then(user => {
            UserController.money(user)
                .then(amount => {
                    res.status(200).json(amount);
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
});

router.post('/pay', isAuthenticated, isAllowed, (req, res) => {
    if (!req.body.sender || !req.body.recipient || !req.body.amount) return res.status(400).json({ err: { status: 400, message: 'did not provide one of: sender, recipient, amount' } });
    const senderPromise = UserController.findUser(req.body.sender);
    const recipientPromise = UserController.findUser(req.body.recipient);
    Promise.all([senderPromise, recipientPromise])
        .then(resolutions => {
            const sender = resolutions[0];
            const recipient = resolutions[1];
            UserController.pay(sender, recipient, req.body.amount, req.body.message)
                .then(resolution => {
                    res.status(200).json(resolution);
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
});

router.post('/order', isAuthenticated, (req, res) => {
    if (!req.params.type) return res.status(400).json({ err: { status: 400, message: 'did not provide a type (buy or sell)' } });
    else if (req.params.type === 'buy') return res.redirect('order/buy');
    else if (req.params.type === 'sell') return res.redirect('order/sell');
    else return res.status(422).json({ err: { status: 422, message: 'invalid order type, should be either buy or sell' } });
});

router.post('/order/buy', isAuthenticated, isAllowed, (req, res) => {
    if (!req.body.user ||
        !req.body.company ||
        !req.body.amount ||
        !req.body.price ||
        !req.body.tolerance ||
        !req.body.expires) return res.status(400).json('missing one or more required parameters');
    const userPromise = UserController.findUser(req.body.user);
    const companyPromise = CompanyController.findCompanyByTicker(req.body.company);
    Promise.all([userPromise, companyPromise])
        .then(resolutions => {
            const user = resolutions[0];
            const company = resolutions[1];
            UserController.placeBuyOrder(
                user,
                company,
                req.body.amount,
                req.body.price,
                req.body.tolerance,
                new Date(req.body.expires)
            ).then(order => {
                if (!order) return res.status(422).json({ err: { status: 422, message: 'user has unsufficient funds to place this order' } });
                res.status(200).json(order);
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

router.post('/order/sell', isAuthenticated, isAllowed, (req, res) => {
    if (!req.body.user ||
        !req.body.company ||
        !req.body.amount ||
        !req.body.price ||
        !req.body.tolerance ||
        !req.body.expires) return res.status(400).json('missing one or more required parameters');
    const userPromise = UserController.findUser(req.body.user);
    const companyPromise = CompanyController.findCompanyByTicker(req.body.company);
    Promise.all([userPromise, companyPromise])
        .then(resolutions => {
            const user = resolutions[0];
            const company = resolutions[1];
            UserController.placeSellOrder(
                user,
                company,
                req.body.amount,
                req.body.price,
                req.body.tolerance,
                new Date(req.body.expires)
            ).then(order => {
                if (!order) return res.status(422).json({ err: { status: 422, message: 'user has unsufficient shares to place this order' } });
                res.status(200).json(order);
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
