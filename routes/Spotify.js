
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
async function getTrack(id, token = null){
  
  try{
    if(!token){
      const access_token = await getToken();
      token = access_token.data.access_token
    }
    return await axios({
      method: "GET",
      url: `https://api.spotify.com/v1/tracks/${id}`,
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }); 
  }catch(error){
    console.log(error);
  }
  
}

async function getArtist(id, token = null){
  try{
    if(!token){
      const access_token = await getToken();
      token = access_token.data.access_token
    }
    
    return await axios({
      method: "GET",
      url: `https://api.spotify.com/v1/artists/${id}`,
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }); 
  }catch(error){
    console.log(error);
  }
}
async function getTrackAndArtist(songID){

  const access_token = await getToken();
  const token = access_token.data.access_token
  const track = await getTrack(songID, token);
  const artistID = track.data.artists[0].id;
  const artist =  await getArtist(artistID,token)
  console.log("artist data", artist.data.images[0].url);
   return {
    trackID : track.data.id,
    songName: track.data.name,
    artistName: artist.data.name,
    artistImage: artist.data.images[0].url,
    albumImage: track.data.album.images[0].url
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

    getTrackAndArtist(req.params.trackID).then(response =>{
      res.render('spotify', {	
        layout: 'spotifyplayer',	
        data : response
      });
    });      	
});


module.exports = router;