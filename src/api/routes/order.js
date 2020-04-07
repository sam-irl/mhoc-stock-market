import express from 'express';
import CompanyController from '../controllers/CompanyController';
import OrderController from '../controllers/OrderController';
import UserController from '../controllers/UserController';
import {
    isAuthenticated,
    isAllowed
} from '../middleware/middleware';

const router = express.Router();

router.post('/company', isAuthenticated, (req, res) => {
    if (!req.body.ticker) return res.status(400).json({ error: { status: 400, message: 'missing \'ticker\' parameter' } });
    if (!req.body.type) {
        CompanyController.findCompanyByTicker(req.body.ticker)
            .then(company => {
                OrderController.getOrdersInCompany(company)
                    .then(orders => {
                        res.status(200).json(orders);
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
        if (!req.params.type || (req.params.type.toLowerCase() !== 'buy' && req.params.type.toLowerCase() !== 'sell')) {
            return res.status(400).json({ error: { status: 400, message: 'missing or invalid \'type\' parameter' } });
        }
        CompanyController.findCompanyByTicker(req.params.ticker)
            .then(company => {
                OrderController.getOrdersInCompanyByType(company, req.params.type.toLowerCase())
                    .then(orders => {
                        res.status(200).json(orders);
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
    }
});

router.post('/company/complement', isAuthenticated, (req, res) => {
    if (req.body.type === 'buy') {
        req.body.type = 'sell'
        return res.redirect('company');
    } else if (req.body.type === 'sell') {
        req.body.type = 'buy';
        return res.redirect('company');
    } else {
        return res.status(400).json({ error: { status: 400, message: 'missing or invalid \'type\' parameter' } });
    }
});

router.post('/', isAuthenticated, (req, res) => {
    OrderController.findOrders(req.body.params || {})
        .then(orders => {
            res.status(200).json(orders);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

export default router;
