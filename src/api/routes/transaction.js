import express from 'express';
import {
    isAuthenticated,
    isAllowed
} from '../middleware/middleware';
import TransactionController from '../controllers/TransactionController';

const router = express.Router();

router.post('/', isAuthenticated, (req, res) => {
    if (req.body.params) {
        TransactionController.findTransactions(req.body.params)
            .then(transactions => {
                res.status(200).json(transactions);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json(err);
            });
    } else {
        TransactionController.findTransactions()
            .then(transactions => {
                res.status(200).json(transactions);
            })
            .catch(err => {
                res.status(500).json(err);
            });
    }
});

export default router;
