import express from 'express';
import {
    isAuthenticated,
    isAllowed
} from '../middleware/middleware';

const router = express.Router();

export default router;
