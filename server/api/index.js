var express = require('express');
var controller = require('./api.controller.js')
var router = express.Router();

router.get('/skattesatser', controller.skattesatser);

module.exports = router;