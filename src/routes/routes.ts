const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

router.get('/', controller.readPath);
router.patch('/', controller.updatePath);
router.post('/file', controller.createFile);
router.post('/folder', controller.createFolder);

module.exports = router;
