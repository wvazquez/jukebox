
const express = require('express');
const router = express.Router();
const axios = require('axios');
require("dotenv").config();

function getToken(){
    const data = axios({
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
    return data;
}

function filterImages(data){
    var filteredData = {};
    Object.keys(data).forEach(type => {
        if(type === 'tracks'){
          console.log(data.tracks)
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

async function spotifySearch(search){
  try{
    const access_token = await getToken();
    return await axios({
      method: 'GET',
      url: "https://api.spotify.com/v1/search",
      headers: {
          'Authorization': `Bearer ${access_token.data.access_token}`,
      },
      params: {
          type: "artist,album,track",
          q: search,
      },
    })
  }catch(error){
    console.log(error);
  }
  
}


router.get('/', (req,res)=>{

    spotifySearch(req.query.search).then(function(response){
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
});

router.get('/tracks/:trackID', (req,res)=>{	
  res.render('spotify', {	
    layout: 'spotifyplayer',	
    trackID: 	req.params.trackID
  });    	
});


module.exports = router;