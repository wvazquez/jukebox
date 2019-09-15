window.onSpotifyWebPlaybackSDKReady = () => {
    const player = new Spotify.Player({
      name: 'Web Playback SDK Quick Start Player',
      getOAuthToken: cb => { cb(token); }
    });
  
  
    // Error handling
    player.addListener('initialization_error', ({ message }) => { console.error(message); });
    player.addListener('authentication_error', ({ message }) => { console.error(message); });
    player.addListener('account_error', ({ message }) => { console.error(message); });
    player.addListener('playback_error', ({ message }) => { console.error(message); });
    player.addListener('player_state_changed', state => { console.log("Player state changed", state); });
  
    // Ready
    player.addListener('ready', ({ device_id }) => { console.log('Ready with Device ID', device_id); });
    player.addListener('not_ready', ({ device_id }) => { console.log('Device ID has gone offline', device_id); });
  
    // Connect to the player!
    player.connect();
  
    $('#togglePlay').on('click', function(){
       if(!isSongInitialized){
         initializeSong();
       }else{
         player.togglePlay();
       }
        
    });
  let isSongInitialized = false;
  
  function initializeSong(){
      const songURI = $('.spotify-container').attr('song');
      isSongInitialized = true;
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${player._options.id}`, {
        method: 'PUT',
        body: JSON.stringify({ uris: [songURI] }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
  }
  };