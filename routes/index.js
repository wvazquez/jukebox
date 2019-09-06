const express = require('express');
const router = express.Router();
const SpotifyRoutes = require('./Spotify');
const SearchRoutes = require('./Search');

/* GET home page. */
router.get('/', function(req, res, next) {
  var dev = res.app.get("env") === 'development' ? true: false;

  res.render('index', { development: dev });
});

// router.use('/spotify', SpotifyRoutes);
router.use('/search', SpotifyRoutes);

module.exports = router;
