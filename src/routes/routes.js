const express = require('express');
const router = express.Router();
const service = require('../services/service');

router.get('/read', service.readPath);
router.get('/', service.renderPage);

module.exports = router;
