const express = require('express');
const router = express.Router();

const { isAuthenticated, isAllowed } = require('../middleware/middleware');

module.exports = router;
