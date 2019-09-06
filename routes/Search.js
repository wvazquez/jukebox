const express = require("express");
const router = express.Router();
const Spotify = require('./Spotify');

router.get('/', (req,res)=>{
    res.render('search');
    // Spotify.getToken().then(function(response){

    // });

});

module.exports = router;