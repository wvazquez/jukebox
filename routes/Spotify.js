
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

function filterSearch(data){
    //pass data object, 
    //filter top songs,artists, or album
        //filter top song
            //filter through popularity

        //removes results with no images
        // data.forEach(type => {
        //     type.items.filter(element => {
        //         if(element.img){
        //             return element;
        //         }  
        //     })
        //     console.log('This is the filered data', type.items);
        // });
        // console.log('This is the filered data', data);
        // console.log(data);
        // var newdata = data.artists.items.forEach(element => {
        var newdata = data.artists.items.filter(element => element.images.length > 0);
    
        
        
        
        // console.log("this is the new data",newdata)
}
function filterImages(data){
    var filteredData = {};
    Object.keys(data).forEach(type => {
      // console.log(type);
        if(type === 'tracks'){
            filteredData[type] = data.tracks.items.filter(element => {
              if(element.album.images.length > 0){
                return element;
              }
            });
        }else if(type === 'artists'){
            filteredData[type] = data.artists.items.filter(element => {
              if(element.images.length > 0){
                return element;
              }
            });
        }else{
            filteredData[type] = data.albums.items.filter(element => {
              if(element.images.length > 0){
                return element;
              }
            });
        }
    });
    return filteredData;
}


router.get('/', (req,res)=>{
        console.log(req.query);
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
                    q: req.query.search,
                },
            }).then(function(response){
                const data = filterImages(response.data);

                return res.render('search',{
                    search: req.query.search,
                    tracks: data.tracks,
                    artists:  data.artists,
                    albums: data.albums
                });
            }).catch(function (error) {
            console.log("Search error: ", error);
          });
        }).catch(function (error) {
            console.log("Token error: ", error);
        });        
});
router.get('/:songID', (req,res)=>{
  res.render('spotify', {
    layout: 'spotifyplayer',
    token: 
      "BQCQkkO8RHMnQahwb9pzjr74nSqQFExyqpfnP-un69m8wYrGQBVXCQ4gfvYnIqcguqipy5wI4qhfPYJOKoM"
  });
});

module.exports = router;