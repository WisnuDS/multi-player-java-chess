var express = require('express');
var path = require('path')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.resolve('views/index.html'));
});

router.get('/test', function(req, res, next) {
  res.render('index')
});

module.exports = router;
