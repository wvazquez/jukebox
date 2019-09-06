
const express = require('express');
const router = express.Router();
const axios = require('axios');
require("dotenv").config();

function getToken(){
    return axios({
        method: 'post',
        url: `https://accounts.spotify.com/api/token`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64'), 
        },
        params: { 
          grant_type: 'client_credentials',
        }      
    })
}

router.get('/', (req,res)=>{
        getToken().then(function(response){
            const token_type  = response.data.token_type;
            const access_token = response.data.access_token;
            axios({
                method: 'GET',
                url: "https://api.spotify.com/v1/search",
                headers: {
                    'Authorization': `${token_type} ${access_token}`,
                },
                params: {
                    type: "artist,album,track",
                    q: "malo",
                    limit: 3
                },
                // data: {
                //     search: 'malo'
                // }
                
            }).then(function(response){
                console.log(response);
                return res.render('search',{
                    search: response.config.params.q,
                    tracks: response.data.tracks.items,
                    artists:  response.data.artists.items,
                    albums: response.data.albums.items
                });
            }).catch(function (error) {
            console.log("Search error: ", error);
          });
        }).catch(function (error) {
            console.log("Token error: ", error);
        });
        // res.render('search');
        
});

module.exports = router;