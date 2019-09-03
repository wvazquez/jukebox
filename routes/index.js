var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var dev = res.app.get("env") === 'development' ? true: false;

  res.render('index', { development: dev });
});

module.exports = router;
