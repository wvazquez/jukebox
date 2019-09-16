window.onSpotifyWebPlaybackSDKReady = () => {
    const token = 'BQDPOgQoUaHl7ryTxedCyc5NQX7fJQXLE7OeHwp1-ntj_5xw7o1-p65ZyRIX2rljvxKFCss3ED8oHM9sN2g3mdYaTD2xqHqUQa855YRTcoLu9ZK7PhOHng3NEJAsm49Uv8M351PHgGbVyhgRHFOGMaSoTU2uVCWIKAaP7B3CAjTtVVaiLT0SFciO0A';
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
       if(!isTrackInitialized){
         initializeTrack();
       }else{
         player.togglePlay();
       }
        
    });
  let isTrackInitialized = false;
  
  function initializeTrack(){
      const trackID = $('.spotify-container').attr('trackID');
      isTrackInitialized = true;
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${player._options.id}`, {
        method: 'PUT',
        body: JSON.stringify({ uris: [`spotify:track:${trackID}`] }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
  }
  };