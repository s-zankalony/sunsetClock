var express = require('express');
var router = express.Router();
var getSunsetData = require('../controllers/getSunsetData');
var getCityFromCoords = require('../controllers/getCityFromCoords');

/* GET home page. */
router.get(`/sunsetData`, getSunsetData);
router.get('/getCity', getCityFromCoords);

module.exports = router;
