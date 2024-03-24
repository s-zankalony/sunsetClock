var express = require('express');
var router = express.Router();
var getSunsetData = require('../controllers/getSunsetData');

/* GET home page. */
router.get(`/`, getSunsetData);

module.exports = router;
