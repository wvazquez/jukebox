
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
    // .then(function(response){
    //        return response.data;
    // }).catch(function (error) {
    //     console.log("Error receiving Spotify Token: ", error);
    //   });
}

router.get('/search', (req,res)=>{
        getToken().then(function(response){
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
            }).catch(function (error) {
            console.log(error);
          });
        });
        
});

module.exports = {router,getToken};