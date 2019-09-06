
const express = require('express');
const router = express.Router();
const axios = require('axios');
require("dotenv").config();

router.get('/search', (req,res)=>{
    
        axios({
            method: 'post',
            url: `https://accounts.spotify.com/api/token`,
            params: { 
              grant_type: 'client_credentials',
            //   code: req.query.code, // code I'm receiving from https://accounts.spotify.com/authorize
            //   redirect_uri: 'http://localhost:9000/done'
            },
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64'), // client id and secret from env
                'Content-Type': 'application/x-www-form-urlencoded',
            },
               
    }).then(function(response){
        const token_type  = response.data.token_type;
        const access_token = response.data.access_token;
        axios({
            method: 'GET',
            url: "https://api.spotify.com/v1/browse/featured-playlists",
            headers: {
                'Authorization': `${token_type} ${access_token}`,
            }
        }).then(function(response){
            console.log(response.data);
        });
        
    }).catch(function (error) {
        console.log(error);
      });;
    console.log('it works');
});

module.exports = router;