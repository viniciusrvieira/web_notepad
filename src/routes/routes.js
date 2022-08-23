const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

router.get('/', controller.readPath);
router.patch('/', controller.updatePath);

module.exports = router;
