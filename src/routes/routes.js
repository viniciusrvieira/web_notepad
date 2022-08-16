const express = require("express");
const router = express.Router();
const service = require("../services/service");

router.get("/", service.readPath);

module.exports = router;
