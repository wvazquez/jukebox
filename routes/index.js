const express = require('express');
const router = express.Router();
const SpotifyRoutes = require('./Spotify');

/* GET home page. */
router.get('/', function(req, res, next) {
  var dev = res.app.get("env") === 'development' ? true: false;

  res.render('index', { development: dev });
});

router.use('/spotify', SpotifyRoutes);


module.exports = router;
