import express from 'express';
import path from 'path';
import company from './routes/company';
import order from './routes/order';
import share from './routes/share';
import transaction from './routes/transaction';
import user from './routes/user';

const router = express.Router();
const { APP_DEPLOYMENT_URL } = require(path.join(__dirname, '../../config.json'));
const { version } = require(path.join(__dirname, '../../package.json'));

router.use('/company', company);
router.use('/order', order);
router.use('/share', share);
router.use('/transaction', transaction);
router.use('/user', user);

router.all('/', (req, res) => {
    const response = {
        status: 'ok',
        version: version,
        deploymentUrl: APP_DEPLOYMENT_URL,
        timestamp: new Date().getTime()
    };
    res.status(200).json(response);
});

export default router;
