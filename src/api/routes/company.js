import express from 'express';
import CompanyController from '../controllers/CompanyController';
import {
    isAuthenticated,
    isAllowed
} from '../middleware/middleware';

const router = express.Router();

router.get('/', isAuthenticated, (req, res) => {
    CompanyController.findCompanyByName
});

export default router;
